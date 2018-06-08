import { each, isFunction } from "lodash";

export const Types = {
  ID: "id",
  STRING: "string",
  NUMBER: "number",
  BOOLEAN: "boolean",
  DATE: "date",
  ARRAY: "array",
  ENUM: "enum",
  MODEL: "model",
  MIXED: "mixed"
};

class Type {
  constructor(name, options = {}) {
    this.name = name;
    this.default = options.default; // STRING, NUMBER, BOOLEAN, DATE, ENUM, MIXED
    this.enum = options.enum; // ENUM
    this.schema = options.schema; // MODEL (might be fn)
    this.of = options.of; // ARRAY
  }
}

const types = {};

each(Types, name => {
  types[name] = options => new Type(name, options);
});

export default types;
