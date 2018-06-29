# Types

Types define the fields on your models, and what kind of data they are. Types can define primitive values, models or references to other models and can also define defaults.

All types are defined the same way: `type.<name>(<options>)`

```javascript
import { types } from 'hypex'

const Author = types.model({
    name: 'Author', 
    props: {
        id: types.id(),
        name: types.string(),
        books: types.array({ 
            of: types.ref({ model: () => Book }), 
            default: [],
        }),
    }
})
const Book = types.model({
    name: 'Book', 
    props: {
        id: types.id(),
        title: types.string(),
        published: types.date(),
        author: types.ref({ model: Author }),
    }
})
```

## Types

### Model

Models are the bread and butter of your state. They compose all of the other types into what a model of something looks like, eg a Route or User and is also used to define the root model of your state \(usually your App\)  `types.model(options)`

| **Option** | **Type** | **Description** |
| --- | --- |
| name | String | The name of your model, eg "User". Required. |
| props | Object | The properties of the model. The key is the name of the property and the value is the "type" that it is. |

### String

A string primitive `types.string(options)`

| **Option** | **Type** | **Description** |
| --- | --- |
| default | String, Function | The default value if none is specified. If type is a function it's return value will be used. Optional, defaults to `null` |

### Number

A number primitive `types.number(options)`

| **Option** | **Type** | **Description** |
| --- | --- |
| default | String, Function | The default value if none is specified. If type is a function it's return value will be used. Optional, defaults to `null` |

### Boolean

A boolean primitive `types.boolean(options)`

| **Option** | **Type** | **Description** |
| --- | --- |
| default | String, Function | The default value if none is specified. If type is a function it's return value will be used. Optional, defaults to `null` |

### Date

A javascript Date `types.date(options)`

| **Option** | **Type** | **Description** |
| --- | --- |
| default | String, Function | The default value if none is specified. If type is a function it's return value will be used. Optional, defaults to `null` |

### Array

An array of types `types.array(options)`

| **Option** | **Type** | **Description** |
| --- | --- | --- |
| of | Type | Specifies what kind of values the array will hold. Can be any other value such as `value.string()` or `value.ref()` etc. Required. |
| default | String, Function | The default value if none is specified. If type is a function it's return value will be used. Optional, defaults to `null` |

### Ref

A reference to another model `types.ref(options)`

| **Option** | **Type** | **Description** |
| --- | --- | --- |
| model | Model, Function | The type of model that this value can be. If type is a function it must be return a Model, this is useful for cyclical references. Required. |
| default | String, Function | The default value if none is specified. If the value is a function it's return value will be used. This value will be coerced into the specified model. Optional, defaults to `null` |

### Id

Defines which field on a model is the id. Each model can only have one id value. This value is used behind the scenes to ensure that only one instance of a model with the same id can exist at a time - even if it is referenced in multiple places in your state!!! `types.id(options)`

| **Option** | **Type** | **Description** |
| --- | --- |
| default | Function | The default value if none is specified. This type must be a function, and is useful for generating id's on the fly. Optional, defaults to `null` |

### Enum

Defines a value that must adhere to a set of enumerator types. `types.enum(options)`

| **Option** | **Type** | **Description** |
| --- | --- | --- |
| enums | \[String\] | An array of enumerator strings that this value can be, eg `types.enum({ enums: ['DRAFT', 'PUBLISHED'] })`. Required. |
| default | String, Function | The default value if none is specified. If the value is a function it's return value will be used. The value must be one of the strings specified in the `enums` option. Optional, defaults to `null` |

### Mixed

The mixed value is useful when a property can be an object and you don't know what kinds of values it will contain. `types.mixed(options)`

| **Option** | **Type** | **Description** |
| --- | --- |
| default | String, Function | The default value if none is specified. If type is a function it's return value will be used. Optional, defaults to `null` |

### Virtual

Defines a derived value from other properties of a model. `types.virtual(options)`

Example: `types.virtual({ get: function () { return this.price * this.amount } })`

| **Option** | **Type** | **Description** |
| --- | --- |
| value | Function | The return value of the function is what the actual value will be on the model. `this` will be bound to the instance of the model. Required. |

