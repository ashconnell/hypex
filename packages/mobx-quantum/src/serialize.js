import { each } from 'lodash'
import { values } from 'mobx'
import { Props } from './props'
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
const serialize = createTransformer(instance => {
  let data = {}
  if (!instance._isStore) {
    data._type = instance._model.name
    data._id = instance._id
  }
  each(instance._model.props, (prop, key) => {
    const value = instance[key]
    if (!value) return
    switch (prop.name) {
      case Props.ID:
      case Props.STRING:
      case Props.NUMBER:
      case Props.BOOLEAN:
      case Props.DATE:
      case Props.ENUM:
      case Props.MIXED:
        data[key] = value
        break
      case Props.ARRAY:
        if (prop.of.name === Props.REF) {
          data[key] = values(instance._ids[key])
        } else {
          data[key] = values(value)
        }
        break
      case Props.REF:
        data[key] = instance._ids[key]
        break
      case Props.VIRTUAL:
        break
      default:
        break
    }
  })
  if (instance._isStore) {
    data._instances = {}
    each(instance._instances, (instance, id) => {
      data._instances[id] = serialize(instance)
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
const toJS = createTransformer(instance => {
  let data = {}
  each(instance._model.props, (prop, key) => {
    const value = instance[key]
    if (!value) return
    switch (prop.name) {
      case Props.ID:
      case Props.STRING:
      case Props.NUMBER:
      case Props.BOOLEAN:
      case Props.DATE:
      case Props.ENUM:
        data[key] = value
        break
      case Props.MIXED:
        data[key] = { ...value }
        break
      case Props.ARRAY:
        if (prop.of.name === Props.REF) {
          data[key] = instance._ids[key].map(id =>
            toJS(instance._store.get(id))
          )
        } else {
          data[key] = values(value)
        }
        break
      case Props.REF:
        data[key] = toJS(instance._store.get(instance._ids[key]))
        break
      case Props.VIRTUAL:
        break
      default:
        break
    }
  })
  return data
})

export { serialize, toJS }
