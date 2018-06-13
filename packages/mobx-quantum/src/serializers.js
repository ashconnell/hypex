import { each } from 'lodash'
import { values } from 'mobx'
import { Values } from './value'
import { createTransformer } from 'mobx-utils'

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
  each(instance._model.props, (value, prop) => {
    const val = instance[prop]
    if (!val) return
    switch (value.type) {
      case Values.ID:
      case Values.STRING:
      case Values.NUMBER:
      case Values.BOOLEAN:
      case Values.DATE:
      case Values.ENUM:
      case Values.MIXED:
        data[prop] = val
        break
      case Values.ARRAY:
        if (value.of.type === Values.REF) {
          data[prop] = values(instance._ids[prop])
        } else {
          data[prop] = values(val)
        }
        break
      case Values.REF:
        data[prop] = instance._ids[prop]
        break
      case Values.VIRTUAL:
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
  each(instance._model.props, (value, prop) => {
    const val = instance[prop]
    if (!val) return
    switch (value.type) {
      case Values.ID:
      case Values.STRING:
      case Values.NUMBER:
      case Values.BOOLEAN:
      case Values.DATE:
      case Values.ENUM:
        data[prop] = val
        break
      case Values.MIXED:
        data[prop] = { ...val }
        break
      case Values.ARRAY:
        if (value.of.type === Values.REF) {
          data[prop] = instance._ids[prop].map(id =>
            toJS(instance._store.get(id))
          )
        } else {
          data[prop] = values(val)
        }
        break
      case Values.REF:
        data[prop] = toJS(instance._store.get(instance._ids[prop]))
        break
      case Values.VIRTUAL:
        break
      default:
        break
    }
  })
  return data
})

export { toSnapshot, toJS }
