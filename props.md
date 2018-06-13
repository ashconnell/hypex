# Values

Values define the fields on your models, and what kind of data they are. Values can define primitive values, reference other models and also define defaults.

All values are defined the same way: `value.<name>(<options>)`

```javascript
import { model, value } from 'mobx-quantum'

const Author = model('Author', {
    id: value.id(),
    name: value.string(),
    books: value.array({ 
        of: value.ref({ model: () => Book }), 
        default: [],
    }),
})
const Book = model('Book', {
    id: value.id(),
    title: value.string(),
    published: value.date(),
    author: value.ref({ model: Author }),
})
```

### Value Types

### String

A string primitive `value.string(options)`

| **Option** | **Type** | **Description** |
| --- | --- |
| default | String, Function | The default value if none is specified. If type is a function it's return value will be used. Optional, defaults to `null` |

### Number

A number primitive `value.number(options)`

| **Option** | **Type** | **Description** |
| --- | --- |
| default | String, Function | The default value if none is specified. If type is a function it's return value will be used. Optional, defaults to `null` |

### Boolean

A boolean primitive `value.boolean(options)`

| **Option** | **Type** | **Description** |
| --- | --- |
| default | String, Function | The default value if none is specified. If type is a function it's return value will be used. Optional, defaults to `null` |

### Date

A javascript Date `value.date(options)`

| **Option** | **Type** | **Description** |
| --- | --- |
| default | String, Function | The default value if none is specified. If type is a function it's return value will be used. Optional, defaults to `null` |

### Array

An array of other props `value.array(options)`

| **Option** | **Type** | **Description** |
| --- | --- | --- |
| of | Value | Specifies what kind of values the array will hold. Can be any other value such as `value.string()` or `value.ref()` etc. Required. |
| default | String, Function | The default value if none is specified. If type is a function it's return value will be used. Optional, defaults to `null` |

### Ref

A reference to another model `value.ref(options)`

| **Option** | **Type** | **Description** |
| --- | --- | --- |
| model | Model, Function | The type of model that this value can be. If type is a function it must be return a Model, this is useful for cyclical references. Required. |
| default | String, Function | The default value if none is specified. If the value is a function it's return value will be used. This value will be coerced into the specified model. Optional, defaults to `null` |

### Id

Defines which field on a model is an id. Each model can only have one id value. This value is used behind the scenes to ensure that only one instance of a model with the same id can exist at a time - even if it is referenced in multiple places in your store!!! `value.id(options)`

| **Option** | **Type** | **Description** |
| --- | --- |
| default | Function | The default value if none is specified. This type must be a function, and is useful for generating id's on the fly. Optional, defaults to `null` |

### Enum

Defines a value that must adhere to a set of enumerator types. `value.enum(options)`

| **Option** | **Type** | **Description** |
| --- | --- | --- |
| enums | \[String\] | An array of enumerator strings that this value can be, eg `value.enum({ enums: ['DRAFT', 'PUBLISHED'] })`. Required. |
| default | String, Function | The default value if none is specified. If the value is a function it's return value will be used. The value must be one of the strings specified in the `enums` option. Optional, defaults to `null` |

### Mixed

The mixed value is useful when a property can be an object and you don't know what kinds of values it will contain. `value.mixed(options)`

| **Option** | **Type** | **Description** |
| --- | --- |
| default | String, Function | The default value if none is specified. If type is a function it's return value will be used. Optional, defaults to `null` |

### Virtual

Defines a derived value from other properties of a model. `value.virtual(options)`

Example: `value.virtual({ value: function () { return this.price * this.amount } })`

| **Option** | **Type** | **Description** |
| --- | --- |
| value | Function | The return value of the function is what the actual value will be on the model. `this` will be bound to the instance of the model. Required. |



