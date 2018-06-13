import { each, includes } from 'lodash'
import { invariant } from './utils'

export const Values = {
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

class Value {
  constructor(type, options = {}) {
    this.type = type
    this.default = options.default // STRING, NUMBER, BOOLEAN, DATE, ENUM, MIXED
    this.enums = options.enums // ENUM
    this.model = options.model // REF
    this.of = options.of // ARRAY
    this.value = options.value // VIRTUAL
    this.validate()
  }
  validate() {
    if (this.type === Values.ENUM) {
      invariant(
        this.default && includes(this.enums, this.default),
        'enum default value must be one of the enums specified'
      )
    }
  }
}

const value = {}

each(Values, type => {
  value[type] = options => new Value(type, options)
})

export default value
