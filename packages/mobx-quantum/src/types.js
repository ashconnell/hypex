import { each, includes } from 'lodash'
import { invariant } from './utils'

export const Types = {
  MODEL: 'model',
  ID: 'id',
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  DATE: 'date',
  ARRAY: 'array',
  ENUM: 'enum',
  REF: 'ref',
  MIXED: 'mixed',
  VIRTUAL: 'virtual',
}

class Type {
  constructor(kind, options = {}) {
    this.kind = kind
    this.name = options.name // MODEL
    this.props = options.props // MODEL
    this.default = options.default // STRING, NUMBER, BOOLEAN, DATE, ENUM, MIXED
    this.enums = options.enums // ENUM
    this.model = options.model // REF
    this.of = options.of // ARRAY
    this.value = options.value // VIRTUAL
    if (this.kind === Types.MODEL) {
      each(this.props, (type, prop) => {
        if (type.kind === Types.ID) {
          this.idProp = prop
        }
      })
    }
    this.validate()
  }
  validate() {
    if (this.kind === Types.ENUM) {
      invariant(
        this.default && includes(this.enums, this.default),
        'enum default value must be one of the enums specified'
      )
    }
  }
}

const types = {}

each(Types, kind => {
  types[kind] = options => new Type(kind, options)
})

export default types
