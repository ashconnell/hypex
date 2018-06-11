# Mobx Quantum

Mobx Quantum is a light-weight wrapper around Mobx 5 that aims to:

- Harness the power of Mobx observables without needing to know they exist
- Let you design a single-state atom for your app
- Automatically keep data normalized, but allow cyclical references in your code
- Output normalized snapshots for rehydration via localStorage/AsyncStorage etc
- Provide action handlers directly on the store
- Handle side-effects using generator services and daemons

**Important***: this is currently a WIP and not ready for production (yet!)

## Installation

```
yarn add mobx-quantum
```

## Store

The store is a single tree of data. You define how it looks using `schemas`. Schemas help to reconcile the types of data you insert into your store.

```javascript
// store.js
import { schema, types, createStore } from 'mobx-quantum'
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
  onChange: ({ snapshot }) => localStorage.setItem('snapshot', JSON.parse(snapshot))
})
```

## Types

The properties on your schemas are defined using `types`. 

Types help to reconcile the data your app puts into your store, such as default values, reference updates, etc 

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

Types are all implemented with the same pattern `types[typeName](options)`

| Option | Description | Example |
|---|---|---|
| default | If no value is provided for this prop, it will use this value. Can be a function if you need to generate values. | `types.string({ default: 'Foobars' })` |
| schema | Used by `types.model()` to define the target type schema. Can be a function to resolve circular references. | `types.model({ schema: Todo })` |
| of | Used by `types.array()` to specify the type of the array items. | `types.array({ of: types.model({ schema: Todo }) })` |
| value | Used for types.virtual to specify the value of the virtual. | `types.virtual({ value: function () { return this.cost * this.amount }})` |

You can combine certain types and options together to form things like this:

```javascript
const Store = schema('Store', {
  todos: types.array({ of: types.model({ schema: Todo }), default: [] }),
})
```

## Actions

Actions are all attached directly to your store

```javascript
// actions.js
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

## Sagas

TODO

## Provider

```javascript
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react'
import Todos from './Todos';
import store from './store'

const App = () => (
  <Provider store={store}>
    <Todos/>
  </Provider>
)

ReactDOM.render(<App />, document.getElementById('root'));
```

## Components (inject/observe)

```javascript
// Todos.js
import { inject, observe } from 'mobx-react'

const Todos = (store) => (
  <h1>Todos</h1>
  <form onSubmit={(e) => { e.preventDefault(); store.addTodo(this.text) }}>
    <input type='text' placeholder='Add todo' onChange={(e) => this.text = e.target.value}/>
  </form>
  {store.todos.map(todo => {
    <p>{todo.text}</p>
  })}
)

export default inject('store')(observer(Todos))
```

# Thanks

This library is very much inspired by some of the most amazing libraries in the community: [mobx](https://github.com/mobxjs/mobx), [mobx-state-tree](https://github.com/mobxjs/mobx-state-tree), [redux](https://github.com/reduxjs/redux), [redux-saga](https://github.com/redux-saga/redux-saga)