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
import { Types } from './types'
import { serialize, toJS } from './serialize'
export { default as types } from './types'

configure({ enforceActions: true })

class Schema {
  constructor(name, props) {
    this.name = name
    this.props = props
    each(props, (type, prop) => {
      if (type.name === Types.ID) {
        this.idKey = prop
      }
    })
  }
}

function buildModel(schema, schemas) {
  if (schema.Model) return
  class Model {
    _schema = schema
    _interceptors = {}
    _id
    _ids = {}
    _models = {}

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
          let snapshot = serialize(this)
          let js = toJS(this)
          console.timeEnd('onChange')
          onChange && onChange({ snapshot, js })
        })
      }
    }
    set(data) {
      if (this._isStore) {
        each(data._models, (data, id) => {
          let schema = schemas[data._type]
          let model = new schema.Model({
            store: this,
            data,
          })
          this._models[model._id] = model
        })
      }
      each(this._schema.props, (type, prop) => {
        const defaultValue = isFunction(type.default)
          ? type.default()
          : type.default
        const value = data[prop] || defaultValue
        if (this._interceptors[prop]) this._interceptors[prop]()
        switch (type.name) {
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
          case Types.ENUM:
          case Types.MIXED:
          case Types.ARRAY:
          case Types.MODEL:
            this[prop] = value
            break
          default:
            break
        }
      })
      if (!this._isStore && !this._id) this._id = data._id || cuid.slug()
    }
    register(model) {
      if (!this._isStore) throw new Error('must register on a store')
      if (model === this) return
      this._models[model._id] = model
    }
    resolveId(schema, data) {
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
      if (data instanceof schema.Model) {
        return data._id
      }
      // object without id
      const id = data[schema.idKey]
      if (!id) {
        let model = new schema.Model({
          store,
          data,
        })
        store._models[model._id] = model
        return model._id
      }
      // object with id
      let model = store._models[id]
      if (!model) {
        model = new schema.Model({
          store,
          data,
        })
        store._models[model._id] = model
      }
      return model._id
    }
    get(id) {
      const store = this._store
      const model = store._models[id]
      return model || id
    }
  }
  Object.defineProperty(Model, 'name', {
    value: schema.name,
    writable: false,
  })
  decorate(Model, {
    _id: observable,
    _ids: observable,
    _models: observable,
  })
  schema.Model = Model
  each(schema.props, (type, prop) => {
    switch (type.name) {
      case Types.ID:
      case Types.STRING:
      case Types.NUMBER:
      case Types.BOOLEAN:
      case Types.DATE:
      case Types.ENUM:
        decorate(Model, { [prop]: observable })
        break
      case Types.MIXED:
        decorate(Model, { [prop]: observable })
        break
      case Types.ARRAY:
        Object.defineProperty(Model.prototype, prop, {
          enumerable: true,
          configurable: true,
          set: function(data) {
            // console.log(`set ${this._id}.${prop}`, data);
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
                return this.resolveId(type.of.schema, child)
              })
              this._ids[prop] = ids
            }
          },
          get: function() {
            let ids = this._ids[prop]
            if (!ids) return null
            ids = observable(ids.map(id => this.get(id)))
            const disposeKey = `${prop}Val`
            if (this._interceptors[disposeKey]) this._interceptors[disposeKey]()
            this._interceptors[disposeKey] = intercept(ids, change => {
              switch (change.type) {
                case 'splice':
                  const ids = change.added.map(value => {
                    return this.resolveId(type.of.schema, value)
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
        decorate(Model, { [prop]: computed })
        break
      case Types.MODEL:
        Object.defineProperty(Model.prototype, prop, {
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
              const id = this.resolveId(type.schema, data)
              this._ids[prop] = id
            }
          },
          get: function() {
            const id = this._ids[prop]
            return this.get(id)
          },
        })
        decorate(Model, { [prop]: computed })
        break
      case Types.VIRTUAL:
        Object.defineProperty(Model.prototype, prop, {
          enumerable: true,
          configurable: true,
          get: type.value,
        })
        decorate(Model, { [prop]: computed })
        break
      default:
        break
    }
  })
  // return schema
}

function resolveSchema(schema, schemas = {}) {
  if (schemas[schema.name]) return
  // load circular schema refs
  each(schema.props, (type, prop) => {
    if (isFunction(type.schema)) {
      type.schema = type.schema()
    }
    if (type.of && isFunction(type.of.schema)) {
      type.of.schema = type.of.schema()
    }
  })
  // pre-register
  schemas[schema.name] = schema
  // register child schemas
  each(schema.props, (type, prop) => {
    if (type.name === Types.MODEL) {
      resolveSchema(type.schema, schemas)
    }
    if (type.name === Types.ARRAY && type.of.name === Types.MODEL) {
      resolveSchema(type.of.schema, schemas)
    }
  })
  return schemas
}

export function createStore(schema, { snapshot, onChange, actions }) {
  if (isFunction(snapshot)) snapshot = snapshot()
  console.time('[quantum] built schemas')
  const schemas = resolveSchema(schema)
  console.timeEnd('[quantum] built schemas')
  console.time('[quantum] built models')
  each(schemas, schema => buildModel(schema, schemas))
  console.timeEnd('[quantum] built models')
  // console.log({ schemas })
  console.time('[quantum] built store')
  const store = new schema.Model({ data: snapshot, onChange, actions })
  console.timeEnd('[quantum] built store')
  return store
}

export function schema(name, props) {
  return new Schema(name, props)
}
