# Mobx Quantum

Important: this is a WIP and isn't published to npm yet, i'm just testing the waters. 

## Build your store

```
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

```
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

```
TODO (no pun intended)
```

## Wrap your app with Provider

```
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

```
// Todos.js
import { injectStore } from 'mobx-quantum'

const Todos = (store) => (
  {store.todos.map(todo => {
    <p>todo.text</p>
  })}
)

export default injectStore(Todos)
```