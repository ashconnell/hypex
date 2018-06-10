import { each } from 'lodash'
import { values } from 'mobx'
import { Types } from './types'
import { createTransformer } from 'mobx-utils'

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
    }
  })
  return data
})

export { serialize, toJS }
