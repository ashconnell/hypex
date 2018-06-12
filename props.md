# Props

The properties on your schemas are defined using `props`.

Props help to reconcile the data your app puts into your store, such as default values, reference updates, etc

| **Prop** | **Note** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| string | A string primitive |
| number | A number primitive |
| boolean | A boolean primitive |
| date | A javascript Date. This will be converted to ISOString in snapshots |
| array | An array of props |
| ref | A reference to another model |
| id | Marks the id property of a model \(max 1 per model\) |
| enum | Defines string enumerator values |
| mixed | An object where the keys vary or are unknown |
| virtual | A derived value from other properties on the model |

Types are all implemented with the same pattern `types[typeName](options)`

| **Option** | **Description** | **Example** |
| --- | --- | --- | --- | --- |
| default | If no value is provided for this prop, it will use this value. Can be a function if you need to generate values. | `types.string({ default: 'Foobars' })` |
| model | Used by `props.ref()` to define the target model type. Can be a function to resolve circular references. | `types.ref({ model: Todo })` |
| of | Used by `types.array()` to specify the type of the array items. | `types.array({ of: types.ref({ model: Todo }) })` |
| value | Used by`types.virtual()`to specify the value of the virtual. | `types.virtual({ value: function () { return this.cost * this.amount }})` |

You can combine certain types and options together to form things like this:

```javascript
const Store = model('Store', {
  todos: types.array({ of: types.ref({ model: Todo }), default: [] })
})
```

### 

