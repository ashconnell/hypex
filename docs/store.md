# State

The state holds all of the data in your app in a tree-like structure.

It is created by using a single model and then all of its child values and other models are combined into a state definition. `createState(model, options)`

```javascript
import { types, createState } from 'mobx-quantum'

const Todo = types.model({
  name: 'Todo', 
  props: {
    text: types.string(),
    done: types.boolean({ default: false })
  }
})

const App = types.model({
  name: 'App', 
  props: {
    todos: types.array({ of: types.ref({ model: Todo }), default: [] })
  }
})

export default createState(App)
```

When creating your state, you can pass in options as the second parameter to do things such as:

* Saving snapshots of your state and rehydrating from a snapshot
* Logging changes to the state for debugging etc

```javascript
export default createState(App, {
  snapshot: JSON.parse(localStorage.getItem('snapshot') || '{}'),
  onSnapshot: snapshot => localStorage.setItem('snapshot', JSON.stringify(snapshot)),
  onChange: data => console.log('onChange', data)
})
```

| **Option** | **Type** | **Description** |
| --- | --- | --- | --- |
| snapshot | JSON, Function | Creates the state with data from a previous snapshot. If snapshot is a function it's return value will be used. If the function returns a promise the data that is resolved will be used. |
| onSnapshot | Function\(snapshot\) | Triggered whenever the state changes. Use this to persist snapshots of the state. Snapshots are created using a normalized map of model instances, if you want to debug or traverse the data use the `onChange`option. |
| onChange | Function\(data\) | Triggered whenever the state changes. The value provided is a proper javascript object representation of your state. Use this for debugging and traversing your state. If you want to persist your state use `onSnapshot` because this data can contain cyclical references |

