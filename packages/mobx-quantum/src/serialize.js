import { each } from 'lodash'
import { values } from 'mobx'
import { Types } from './types'
import { createTransformer } from 'mobx-utils'

/**
 * serialize outputs a normalized data snapshot
 * useful for storing in localStorage/AsyncStorage
 * etc for re-hydrating the store.
 *
 * A snapshot is basically a single map of
 * `{ [id]: model }` and models without ids
 * are assigned one behind the scenes
 */
const serialize = createTransformer(model => {
  let data = {}
  if (!model._isStore) {
    data._type = model._schema.name
    data._id = model._id
  }
  each(model._schema.props, (type, prop) => {
    const value = model[prop]
    if (!value) return
    switch (type.name) {
      case Types.ID:
      case Types.STRING:
      case Types.NUMBER:
      case Types.BOOLEAN:
      case Types.DATE:
      case Types.ENUM:
      case Types.MIXED:
        data[prop] = value
        break
      case Types.ARRAY:
        if (type.of.name === Types.MODEL) {
          data[prop] = values(model._ids[prop])
        } else {
          data[prop] = values(value)
        }
        break
      case Types.MODEL:
        data[prop] = model._ids[prop]
        break
      case Types.VIRTUAL:
        break
      default:
        break
    }
  })
  if (model._isStore) {
    data._models = {}
    each(model._models, (model, id) => {
      data._models[id] = serialize(model)
    })
  }
  return data
})

/**
 * toJS outputs exactly what you would expect
 * after building your store schema.
 * Cyclical references are kept intact.
 * This should be used to inspect the state of
 * your store, and should not be put into
 * localStorage/AsyncStorage etc
 */
const toJS = createTransformer(model => {
  let data = {}
  each(model._schema.props, (type, prop) => {
    const value = model[prop]
    if (!value) return
    switch (type.name) {
      case Types.ID:
      case Types.STRING:
      case Types.NUMBER:
      case Types.BOOLEAN:
      case Types.DATE:
      case Types.ENUM:
        data[prop] = value
        break
      case Types.MIXED:
        data[prop] = { ...value }
        break
      case Types.ARRAY:
        if (type.of.name === Types.MODEL) {
          data[prop] = model._ids[prop].map(id => toJS(model._store.get(id)))
        } else {
          data[prop] = values(value)
        }
        break
      case Types.MODEL:
        data[prop] = toJS(model._store.get(model._ids[prop]))
        break
      case Types.VIRTUAL:
        break
      default:
        break
    }
  })
  return data
})

export { serialize, toJS }
