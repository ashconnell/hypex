import {
  intercept,
  autorun,
  extendObservable,
  computed,
  action,
  flow,
  configure,
  decorate,
  observable,
} from 'mobx'
import { each, isString, isNumber, isFunction, includes } from 'lodash'
import cuid from 'cuid'
import { Types } from './types'
import { toSnapshot, toJS } from './serializers'
export { default as types } from './types'
export * from './effects'
import { invariant } from './utils'
import config from './config'

configure({ enforceActions: true })

function buildInstance(model, models) {
  if (model.Instance) return
  class Instance {
    _model = model
    _interceptors = {}
    _id
    _ids = {}
    _instances = {}

    constructor({ store, data, onSnapshot, onChange, actions }) {
      if (!data) data = {}
      this._isStore = !store
      this._store = store || this
      if (this._isStore && actions) {
        extendObservable(
          this,
          {
            action: (name, ...args) => {
              actions[name](this, ...args)
            },
          },
          {
            action: action,
          }
        )
      }
      this.set(data)
      this._store.register(this)
      if (this._isStore) {
        autorun(() => {
          // console.time('toSnapshot')
          this._snapshot = toSnapshot(this)
          // console.timeEnd('toSnapshot')
          // console.time('toJS')
          this._js = toJS(this)
          // console.timeEnd('toJS')
          onChange && onChange(this._js)
          onSnapshot && onSnapshot(this._snapshot)
        })
      }
    }
    set(data) {
      if (this._isStore) {
        each(data._instances, (data, id) => {
          let model = models[data._type]
          let instance = new model.Instance({
            store: this,
            data,
          })
          this._instances[instance._id] = instance
        })
      }
      each(this._model.props, (type, prop) => {
        const defaultValue = isFunction(type.default)
          ? type.default()
          : type.default
        const value = data[prop] || defaultValue
        if (this._interceptors[prop]) this._interceptors[prop]()
        switch (type.kind) {
          case Types.ID:
            this._interceptors[prop] = intercept(this, prop, change => {
              this._id = change.newValue || cuid.slug()
              return change
            })
            this[prop] = value
            break
          case Types.STRING:
          case Types.NUMBER:
          case Types.BOOLEAN:
          case Types.DATE:
          case Types.OBJECT:
          case Types.ARRAY:
          case Types.REF:
            this[prop] = value
            break
          case Types.ENUM:
            if (!config.prod) {
              this._interceptors[prop] = intercept(this, prop, change => {
                invariant(
                  change.newValue && includes(type.enums, change.newValue),
                  `received enum '${
                    change.newValue
                  }' but expected one of: ${type.enums.join(', ')}`
                )
                return change
              })
            }
            this[prop] = value
            break
          default:
            break
        }
      })
      if (!this._isStore && !this._id) this._id = data._id || cuid.slug()
    }
    register(instance) {
      if (!this._isStore) throw new Error('must register on a store')
      if (instance === this) return
      this._instances[instance._id] = model
    }
    resolveId(model, data) {
      const store = this._store
      /**
       * data could be:
       * - an id (string/number)
       * - a model
       * - a plain object
       * and it might not have an id prop
       */
      if (!data) return null
      // id
      if (isString(data) || isNumber(data)) {
        return data
      }
      // model
      if (data instanceof model.Instance) {
        return data._id
      }
      // object without id
      const id = data[model.idProp]
      if (!id) {
        let instance = new model.Instance({
          store,
          data,
        })
        store._instances[instance._id] = instance
        return instance._id
      }
      // object with id
      let instance = store._instances[id]
      if (instance) {
        instance.set(data)
      } else {
        instance = new model.Instance({
          store,
          data,
        })
        store._instances[instance._id] = instance
      }
      return instance._id
    }
    get(id) {
      const store = this._store
      const instance = store._instances[id]
      return instance || id
    }
  }
  Object.defineProperty(Instance, 'name', {
    value: model.name,
    writable: false,
  })
  decorate(Instance, {
    _id: observable,
    _ids: observable,
    _instances: observable,
  })
  model.Instance = Instance
  each(model.props, (type, prop) => {
    switch (type.kind) {
      case Types.ID:
      case Types.STRING:
      case Types.NUMBER:
      case Types.BOOLEAN:
      case Types.DATE:
      case Types.ENUM:
        decorate(Instance, { [prop]: observable })
        break
      case Types.OBJECT:
        decorate(Instance, { [prop]: observable })
        break
      case Types.ARRAY:
        Object.defineProperty(Instance.prototype, prop, {
          enumerable: true,
          configurable: true,
          set: function(data) {
            // console.log(`set ${this._id}.${key}`, data);
            /**
             * data could be an array of any:
             * - id (string/number)
             * - model
             * - plain object
             */
            if (!data) {
              this._ids[prop] = null
            } else {
              let ids = data.map(child => {
                return this.resolveId(type.of.model, child)
              })
              this._ids[prop] = ids
            }
          },
          get: function() {
            let ids = this._ids[prop]
            if (!ids) return null
            ids = observable(ids.map(id => this.get(id)))
            const disposeProp = `${prop}Val`
            if (this._interceptors[disposeProp])
              this._interceptors[disposeProp]()
            this._interceptors[disposeProp] = intercept(ids, change => {
              switch (change.type) {
                case 'splice':
                  const ids = change.added.map(data => {
                    return this.resolveId(type.of.model, data)
                  })
                  this._ids[prop].splice(
                    change.index,
                    change.removedCount,
                    ...ids
                  )
                  break
                default:
                  break
              }
              return change
            })
            return ids
          },
        })
        decorate(Instance, { [prop]: computed })
        break
      case Types.REF:
        Object.defineProperty(Instance.prototype, prop, {
          enumerable: true,
          configurable: true,
          set: function(data) {
            /**
             * data could be:
             * - an id (string/number)
             * - a model
             * - a plain object
             */
            if (!data) {
              this._ids[prop] = null
            } else {
              const id = this.resolveId(type.model, data)
              this._ids[prop] = id
            }
          },
          get: function() {
            const id = this._ids[prop]
            return this.get(id)
          },
        })
        decorate(Instance, { [prop]: computed })
        break
      case Types.VIRTUAL:
        Object.defineProperty(Instance.prototype, prop, {
          enumerable: true,
          configurable: true,
          get: type.get,
        })
        decorate(Instance, { [prop]: computed })
        break
      default:
        break
    }
  })
  // return schema
}

function resolveModelTree(model, models = {}) {
  if (model[model.name]) return
  // load circular schema refs
  each(model.props, (value, prop) => {
    if (isFunction(value.model)) {
      value.model = value.model()
    }
    if (value.of && isFunction(value.of.model)) {
      value.of.model = value.of.model()
    }
  })
  // pre-register
  models[model.name] = model
  // register child schemas
  each(model.props, (type, prop) => {
    if (type.kind === Types.REF) {
      resolveModelTree(type.model, models)
    }
    if (type.kind === Types.ARRAY && type.of.kind === Types.REF) {
      resolveModelTree(type.of.model, models)
    }
  })
  return models
}

export function createState(model, options = {}) {
  invariant(model.kind === Types.MODEL, 'createState root type must be model')
  let { snapshot, onSnapshot, onChange, actions } = options
  if (isFunction(snapshot)) snapshot = snapshot()
  // console.time('[hypex] built models')
  const models = resolveModelTree(model)
  // console.timeEnd('[hypex] built models')
  // console.time('[hypex] built models')
  each(models, model => buildInstance(model, models))
  // console.timeEnd('[hypex] built models')
  // console.log({ models })
  // console.time('[hypex] built state')
  const state = new model.Instance({
    data: snapshot,
    onSnapshot,
    onChange,
    actions,
  })
  // console.timeEnd('[hypex] built state')
  return state
}
