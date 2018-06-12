import { each } from 'lodash'

export const Props = {
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

class Prop {
  constructor(name, options = {}) {
    this.name = name
    this.default = options.default // STRING, NUMBER, BOOLEAN, DATE, ENUM, MIXED
    this.enum = options.enum // ENUM
    this.model = options.model // REF (might be fn)
    this.of = options.of // ARRAY
    this.value = options.value // VIRTUAL
  }
}

const props = {}

each(Props, name => {
  props[name] = options => new Prop(name, options)
})

export default props
