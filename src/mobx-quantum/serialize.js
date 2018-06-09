import { each } from 'lodash'
import { get } from 'mobx'
import { Types } from './types'
import { createTransformer } from 'mobx-utils'

const serializeModel = createTransformer(model => {
  let data = {}
  data._type = model._schema.name
  data._id = model._id
  each(model._schema.props, (type, prop) => {
    const value = model[prop]
    if (!value) return
    if (type.name === Types.MODEL) {
      data[prop] = get(model._ids, prop)
    } else if (type.name === Types.ARRAY) {
      if (type.of.name === Types.MODEL) {
        data[prop] = get(model._ids, prop).slice()
      } else {
        data[prop] = value.slice()
      }
    } else {
      data[prop] = value
    }
  })
  if (model._isStore) {
    data._models = {}
    each(model._models, (model, id) => {
      data._models[id] = serializeModel(model)
    })
  }
  return data
})

export default serializeModel
