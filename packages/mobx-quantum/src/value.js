import { each } from 'lodash'

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
    this.enum = options.enum // ENUM
    this.model = options.model // REF
    this.of = options.of // ARRAY
    this.value = options.value // VIRTUAL
  }
}

const value = {}

each(Values, type => {
  value[type] = options => new Value(type, options)
})

export default value
