# Store

The store holds all of the data in your app in a tree-like structure.

It is created by using a single model and then all of its child values and other models are combined into a store definition. `createStore(model, options)`

```javascript
import { model, value, createStore } from 'mobx-quantum'

const Todo = model('Todo', {
  text: value.string(),
  done: value.boolean({ default: false })
})

const Store = model('Store', {
  todos: value.array({ of: value.ref({ model: Todo }), default: [] })
})

export default createStore(Store)
```

When creating a store, you can pass in options as the second parameter to do things such as:

* Saving snapshots of your store and rehydrating from a snapshot
* Logging changes to the store for debugging etc

```javascript
export default createStore(Store, {
  snapshot: JSON.parse(localStorage.getItem('snapshot') || '{}'),
  onChange: ({ snapshot }) => localStorage.setItem('snapshot', JSON.parse(snapshot))
})
```

| **Option** | **Type** | **Description** |
| --- | --- | --- | --- |
| snapshot | JSON, Function | Creates the store with data from a previous snapshot. If snapshot is a function it's return value will be used. If the function returns a promise the data that is resolved will be used. |
| onSnapshot | Function\(snapshot\) | Triggered whenever the store data changes. Use this to persist snapshots of the store. Snapshots are created using a normalized map of model instances, if you want to debug or traverse the data use the `onChange`option. |
| onChange | Function\(data\) | Triggered whenever the store data changes. The value provided is a proper javascript object representation of your store. Use this for debugging and traversing your store. If you want to persist your store use `onSnapshot`, because this data can contain cyclical references |



