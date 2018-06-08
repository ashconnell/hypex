import {
  get,
  set,
  intercept,
  autorun,
  extendObservable,
  computed,
  toJS,
  action,
  configure,
  decorate,
  observable,
} from 'mobx'
import { each, isString, isNumber, isFunction } from 'lodash'
import cuid from 'cuid'
import { Types } from './types'
import serialize from './serialize'
export { default as types } from './types'

configure({ enforceActions: false })

const schemas = {}

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

function registerSchema(schema, actions) {
  if (isFunction(schema)) {
    schema = schema()
  }
  if (schemas[schema.name]) {
    return schemas[schema.name]
  }
  class Model {
    $ = {
      ids: new Map(),
    }
    constructor({ store, data, onSnapshot, actions }) {
      if (!data) data = {}
      this.$disposers = {}
      this.$.schema = schema
      this.$.ids = new Map()
      this.$.isStore = !store
      this.$.store = store || this
      this.$.disposers = {}
      if (this.$.isStore) {
        this.$.models = observable(new Map())
        this.actions = {}
        each(actions, (method, name) => {
          this[name] = function(...args) {
            method(this)(...args)
          }
          decorate(this, { [name]: action })
        })
      }
      this.set(data)
      this.$.store.register(this)
      if (this.$.isStore) {
        autorun(() => {
          let snapshot = serialize(this)
          // console.log(this);
          onSnapshot && onSnapshot(snapshot)
        })
      }
    }
    set(data) {
      if (this.$.isStore) {
        each(data.$models, (data, id) => {
          let schema = schemas[data.$type]
          let model = new schema.Model({
            store: this,
            data,
          })
          set(this.$.models, model.$.id, model)
        })
      }
      each(this.$.schema.props, (type, prop) => {
        const defaultValue = isFunction(type.default)
          ? type.default()
          : type.default
        const value = data[prop] || defaultValue
        if (this.$.disposers[prop]) this.$.disposers[prop]()
        switch (type.name) {
          case Types.ID:
            this.$.disposers[prop] = intercept(this, prop, change => {
              this.$.id = change.newValue || cuid()
              return change
            })
            this[prop] = value
            break
          case Types.STRING:
          case Types.NUMBER:
          case Types.BOOLEAN:
          case Types.DATE:
          case Types.ENUM:
            this[prop] = value
            break
          case Types.MIXED:
            this[prop] = value
            break
          case Types.ARRAY:
            this[prop] = value
            break
          case Types.MODEL:
            this[prop] = value
            break
          default:
            break
        }
      })
      if (!this.$.id) this.$.id = cuid()
    }
    register(model) {
      if (!this.$.isStore) throw new Error('must register on a store')
      if (model === this) return
      set(this.$.models, model.$.id, model)
    }
    resolveId(schema, data) {
      const store = this.$.store
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
      if (isFunction(schema)) {
        schema = schema()
      }
      // model
      if (data instanceof schema.Model) {
        return data.$.id
      }
      // object without id
      const id = data[schema.idKey]
      if (!id) {
        let model = new schema.Model({
          store,
          data,
        })
        set(store.$.models, model.$.id, model)
        return model.$.id
      }
      // object with id
      let model = get(store.$.models, id)
      if (!model) {
        model = new schema.Model({
          store,
          data,
        })
        set(store.$.models, model.$.id, model)
      }
      return model.$.id
    }
    get(id) {
      const store = this.$.store
      return get(store.$.models, id) || id
    }
  }
  Object.defineProperty(Model, 'name', {
    value: schema.name,
    writable: false,
  })
  decorate(Model, {
    $: observable,
  })
  schema.Model = Model
  schemas[schema.name] = schema
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
        if (type.of.name === Types.MODEL) {
          registerSchema(type.of.schema)
        }
        Object.defineProperty(Model.prototype, prop, {
          enumerable: true,
          configurable: true,
          set: function(data) {
            // console.log(`set ${this.$.id}.${prop}`, data);
            /**
             * data could be an array of any:
             * - id (string/number)
             * - model
             * - plain object
             */
            if (!data) {
              set(this.$.ids, prop, null)
              return
            }
            let ids = observable(
              data.map(child => {
                return this.resolveId(type.of.schema, child)
              })
            )
            set(this.$.ids, prop, ids)
            console.log('>>> 1')
          },
          get: function() {
            // console.log(`get ${this.$.id}.${prop}`);
            let ids = get(this.$.ids, prop)
            if (!ids) return null
            // ids = observable(ids.map(id => this.get(id)));
            ids = observable(ids.map(id => this.get(id)))
            const disposeKey = `${prop}Val`
            if (this.$disposers[disposeKey]) this.$disposers[disposeKey]()
            this.$disposers[disposeKey] = intercept(ids, change => {
              console.log('>>> 2')
              // console.log(`splice ${this.$.id}.${prop}`, change);
              switch (change.type) {
                case 'splice':
                  const ids = change.added.map(value => {
                    return this.resolveId(type.of.schema, value)
                  })
                  // get(this.$.ids, prop).splice(
                  //   change.index,
                  //   change.removedCount,
                  //   ...ids
                  // );
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
        registerSchema(type.schema)
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
            const id = this.resolveId(type.schema, data)
            set(this.$.ids, prop, id)
          },
          get: function() {
            const id = get(this.$.ids, prop)
            return this.get(id)
          },
        })
        decorate(Model, { [prop]: computed })
        break
      default:
        break
    }
  })
  return schema
}

export function createStore(schema, { snapshot, onSnapshot, actions }) {
  const Store = registerSchema(schema).Model
  return new Store({ data: snapshot, onSnapshot, actions })
}

export function schema(name, props) {
  return new Schema(name, props)
}
