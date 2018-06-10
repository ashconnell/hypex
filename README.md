# Mobx Quantum

Important: this is a WIP and isn't published to npm yet, i'm just testing the waters. 

## Build your store

```javascript
// store.js
import { schema, types } from 'mobx-quantum'
import actions from './actions'

const Todo = schema('Todo', {
  text: types.string(),
  done: types.boolean({ default: false })
})

const Store = schema('Store', {
  todos: types.array({ of: types.model({ schema: Todo }), default: [] })
})

export default createStore(Store, {
  snapshot: JSON.parse(localStorage.getItem('snapshot') || '{}'),
  onSnapshot: snapshot => localStorage.setItem('snapshot', JSON.parse(snapshot))
})
```

## Define the actions for your store

```javascript
// actions.js
import { flow } from 'mobx-quantum'
import api from './api'

const fetchTodos = store => flow(function* () {
  const todos = yield api.get('/todos')
  store.todos = todos
})

const addTodo = store => text => {
  store.todos.push({ text })
}

export default {
  fetchTodos,
  addTodo
}
```

## Define side effects

```javascript
TODO (no pun intended)
```

## Wrap your app with Provider

```javascript
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-quantum'
import Todos from './Todos';
import store from './store'

const App = () => (
  <Provider store={store}>
    <Todos/>
  </Provider>
)

ReactDOM.render(<App />, document.getElementById('root'));
```

## Wrap components with inject

```javascript
// Todos.js
import { injectStore } from 'mobx-quantum'

const Todos = (store) => (
  <h1>Todos</h1>
  <form onSubmit={(e) => { e.preventDefault(); store.addTodo(this.text) }}>
    <input type='text' placeholder='Add todo' onChange={(e) => this.text = e.target.value}/>
  </form>
  {store.todos.map(todo => {
    <p>{todo.text}</p>
  })}
)

export default injectStore(Todos)
```

## Types

Use Types to define the properties on a schema.

The following types are available:

| Type | Note |
|---|---|
| string | A string primitive |
| number | A number primitive |
| boolean | A boolean primitive |
| date | A javascript Date. This will be converted to ISOString in snapshots |
| array | An array of types |
| model | A reference to another model |
| id | Marks the id property of a model (max 1 per model) |
| enum | Defines string enumerator values |
| mixed | An object where the keys vary or are unknown |
| virtual | A derived value from other properties on the model |

Types are created by passing in options:

| Option | Description | Example |
|---|---|---|
| default | If no value is provided for this prop, it will use this value. Can be a function if you need to generate values. | `types.string({ default: 'Foobars' })` |
| schema | Used for types.model to reference the target schema. Can be a function to make circular references. | `types.model({ schema: Todo })` |
| of | Used for types.array to specify the type of the array items. | `types.array({ of: types.model({ schema: Todo }) })` |
| value | Used for types.virtual to specify the value of the virtual. | `types.virtual({ value: function () { return this.cost * this.amount }})` |

You can use certain options together to form things like:

```javascript
const Store = schema('Store', {
  todos: types.array({ of: types.model({ schema: Todo }), default: [] }),
})
```