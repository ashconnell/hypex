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
import { each, isString, isNumber, isFunction } from 'lodash'
import cuid from 'cuid'
import { Props } from './props'
import { serialize, toJS } from './serialize'
export { default as props } from './props'
export * from './effects'

console.log('WTF')

configure({ enforceActions: true })

class Model {
  constructor(name, props) {
    this.name = name
    this.props = props
    each(props, (prop, key) => {
      if (prop.name === Props.ID) {
        this.idKey = key
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

    constructor({ store, data, onChange, actions }) {
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
          console.time('onChange')
          this._snapshot = serialize(this)
          this._js = toJS(this)
          console.timeEnd('onChange')
          onChange && onChange({ snapshot: this._snapshot, js: this._js })
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
      each(this._model.props, (prop, key) => {
        const defaultValue = isFunction(prop.default)
          ? prop.default()
          : prop.default
        const value = data[key] || defaultValue
        if (this._interceptors[key]) this._interceptors[key]()
        switch (prop.name) {
          case Props.ID:
            this._interceptors[key] = intercept(this, key, change => {
              this._id = change.newValue || cuid.slug()
              return change
            })
            this[key] = value
            break
          case Props.STRING:
          case Props.NUMBER:
          case Props.BOOLEAN:
          case Props.DATE:
          case Props.ENUM:
          case Props.MIXED:
          case Props.ARRAY:
          case Props.REF:
            this[key] = value
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
      const id = data[model.idKey]
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
  each(model.props, (prop, key) => {
    switch (prop.name) {
      case Props.ID:
      case Props.STRING:
      case Props.NUMBER:
      case Props.BOOLEAN:
      case Props.DATE:
      case Props.ENUM:
        decorate(Instance, { [key]: observable })
        break
      case Props.MIXED:
        decorate(Instance, { [key]: observable })
        break
      case Props.ARRAY:
        Object.defineProperty(Instance.prototype, key, {
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
              this._ids[key] = null
            } else {
              let ids = data.map(child => {
                return this.resolveId(prop.of.model, child)
              })
              this._ids[key] = ids
            }
          },
          get: function() {
            let ids = this._ids[key]
            if (!ids) return null
            ids = observable(ids.map(id => this.get(id)))
            const disposeKey = `${key}Val`
            if (this._interceptors[disposeKey]) this._interceptors[disposeKey]()
            this._interceptors[disposeKey] = intercept(ids, change => {
              switch (change.type) {
                case 'splice':
                  const ids = change.added.map(value => {
                    return this.resolveId(prop.of.model, value)
                  })
                  this._ids[key].splice(
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
        decorate(Instance, { [key]: computed })
        break
      case Props.REF:
        Object.defineProperty(Instance.prototype, key, {
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
              this._ids[key] = null
            } else {
              const id = this.resolveId(prop.model, data)
              this._ids[key] = id
            }
          },
          get: function() {
            const id = this._ids[key]
            return this.get(id)
          },
        })
        decorate(Instance, { [key]: computed })
        break
      case Props.VIRTUAL:
        Object.defineProperty(Instance.prototype, key, {
          enumerable: true,
          configurable: true,
          get: prop.value,
        })
        decorate(Instance, { [key]: computed })
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
  each(model.props, (prop, key) => {
    if (isFunction(prop.model)) {
      prop.model = prop.model()
    }
    if (prop.of && isFunction(prop.of.model)) {
      prop.of.model = prop.of.model()
    }
  })
  // pre-register
  models[model.name] = model
  // register child schemas
  each(model.props, (prop, key) => {
    if (prop.name === Props.REF) {
      resolveModelTree(prop.model, models)
    }
    if (prop.name === Props.ARRAY && prop.of.name === Props.REF) {
      resolveModelTree(prop.of.model, models)
    }
  })
  return models
}

export function createStore(model, options = {}) {
  let { snapshot, onChange, actions } = options
  if (isFunction(snapshot)) snapshot = snapshot()
  console.time('[quantum] built models')
  const models = resolveModelTree(model)
  console.timeEnd('[quantum] built models')
  console.time('[quantum] built models')
  each(models, model => buildInstance(model, models))
  console.timeEnd('[quantum] built models')
  // console.log({ models })
  console.time('[quantum] built store')
  const store = new model.Instance({ data: snapshot, onChange, actions })
  console.timeEnd('[quantum] built store')
  return store
}

export function model(name, props) {
  return new Model(name, props)
}
