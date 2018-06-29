import { each } from 'lodash'
import { values } from 'mobx'
import { createTransformer } from 'mobx-utils'
import { Types } from './types'

/**
 * toSnapshot outputs a normalized data snapshot
 * useful for storing in localStorage/AsyncStorage
 * etc for re-hydrating the store.
 *
 * A snapshot is basically a single map of
 * `{ [id]: model }` and models without ids
 * are assigned one behind the scenes
 */
const toSnapshot = createTransformer(instance => {
  let data = {}
  if (!instance._isStore) {
    data._type = instance._model.name
    data._id = instance._id
  }
  each(instance._model.props, (type, prop) => {
    const value = instance[prop]
    if (!value) return
    switch (type.kind) {
      case Types.ID:
      case Types.STRING:
      case Types.NUMBER:
      case Types.BOOLEAN:
      case Types.DATE:
      case Types.ENUM:
      case Types.OBJECT:
        data[prop] = value
        break
      case Types.ARRAY:
        if (type.of.kind === Types.REF) {
          data[prop] = values(instance._ids[prop])
        } else {
          data[prop] = values(value)
        }
        break
      case Types.REF:
        data[prop] = instance._ids[prop]
        break
      case Types.VIRTUAL:
        break
      default:
        break
    }
  })
  if (instance._isStore) {
    data._instances = {}
    each(instance._instances, (instance, id) => {
      data._instances[id] = toSnapshot(instance)
    })
  }
  return data
})

/**
 * toJS outputs exactly what you would expect
 * after building your store models.
 * Cyclical references are kept intact.
 * This should be used to inspect the state of
 * your store, and should not be put into
 * localStorage/AsyncStorage etc
 */
const toJS = createTransformer(instance => {
  let data = {}
  each(instance._model.props, (type, prop) => {
    const value = instance[prop]
    if (!value) return
    switch (type.kind) {
      case Types.ID:
      case Types.STRING:
      case Types.NUMBER:
      case Types.BOOLEAN:
      case Types.DATE:
      case Types.ENUM:
        data[prop] = value
        break
      case Types.OBJECT:
        data[prop] = { ...value }
        break
      case Types.ARRAY:
        if (type.of.kind === Types.REF) {
          data[prop] = instance._ids[prop].map(id =>
            toJS(instance._store.get(id))
          )
        } else {
          data[prop] = values(value)
        }
        break
      case Types.REF:
        data[prop] = toJS(instance._store.get(instance._ids[prop]))
        break
      case Types.VIRTUAL:
        break
      default:
        break
    }
  })
  return data
})

export { toSnapshot, toJS }
