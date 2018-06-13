import {
  intercept,
  autorun,
  extendObservable,
  computed,
  action,
  configure,
  decorate,
  observable,
} from 'mobx'
import { each, isString, isNumber, isFunction, includes } from 'lodash'
import cuid from 'cuid'
import { Values } from './value'
import { toSnapshot, toJS } from './serializers'
export { default as value } from './value'
export * from './effects'
import { invariant } from './utils'
import config from './config'

configure({ enforceActions: true })

class Model {
  constructor(name, props) {
    this.name = name
    this.props = props
    each(props, (value, prop) => {
      if (value.type === Values.ID) {
        this.idProp = prop
      }
    })
  }
}

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
      if (this._isStore) {
        each(actions, (method, name) => {
          extendObservable(
            this,
            {
              [name]: (...args) => method(this)(...args),
            },
            {
              [name]: action,
            }
          )
        })
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
      each(this._model.props, (value, prop) => {
        const defaultVal = isFunction(value.default)
          ? value.default()
          : value.default
        const val = data[prop] || defaultVal
        if (this._interceptors[prop]) this._interceptors[prop]()
        switch (value.type) {
          case Values.ID:
            this._interceptors[prop] = intercept(this, prop, change => {
              this._id = change.newValue || cuid.slug()
              return change
            })
            this[prop] = val
            break
          case Values.STRING:
          case Values.NUMBER:
          case Values.BOOLEAN:
          case Values.DATE:
          case Values.MIXED:
          case Values.ARRAY:
          case Values.REF:
            this[prop] = val
            break
          case Values.ENUM:
            if (!config.prod) {
              this._interceptors[prop] = intercept(this, prop, change => {
                invariant(
                  change.newValue && includes(value.enums, change.newValue),
                  `received enum '${
                    change.newValue
                  }' but expected one of: ${value.enums.join(', ')}`
                )
                return change
              })
            }
            this[prop] = val
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
  each(model.props, (value, prop) => {
    switch (value.type) {
      case Values.ID:
      case Values.STRING:
      case Values.NUMBER:
      case Values.BOOLEAN:
      case Values.DATE:
      case Values.ENUM:
        decorate(Instance, { [prop]: observable })
        break
      case Values.MIXED:
        decorate(Instance, { [prop]: observable })
        break
      case Values.ARRAY:
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
                return this.resolveId(value.of.model, child)
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
                    return this.resolveId(value.of.model, data)
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
      case Values.REF:
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
              const id = this.resolveId(value.model, data)
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
      case Values.VIRTUAL:
        Object.defineProperty(Instance.prototype, prop, {
          enumerable: true,
          configurable: true,
          get: value.value,
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
  each(model.props, (value, prop) => {
    if (value.type === Values.REF) {
      resolveModelTree(value.model, models)
    }
    if (value.type === Values.ARRAY && value.of.type === Values.REF) {
      resolveModelTree(value.of.model, models)
    }
  })
  return models
}

export function createStore(model, options = {}) {
  let { snapshot, onSnapshot, onChange, actions } = options
  if (isFunction(snapshot)) snapshot = snapshot()
  // console.time('[quantum] built models')
  const models = resolveModelTree(model)
  // console.timeEnd('[quantum] built models')
  // console.time('[quantum] built models')
  each(models, model => buildInstance(model, models))
  // console.timeEnd('[quantum] built models')
  // console.log({ models })
  // console.time('[quantum] built store')
  const store = new model.Instance({
    data: snapshot,
    onSnapshot,
    onChange,
    actions,
  })
  // console.timeEnd('[quantum] built store')
  return store
}

export function model(name, props) {
  return new Model(name, props)
}
