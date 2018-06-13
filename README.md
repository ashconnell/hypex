# Mobx Quantum

**Important**: this is currently a WIP and not ready for production \(yet!\)

Mobx Quantum is state management library based on [Mobx](https://github.com/mobxjs/mobx). It provides a simple way to define a single state atom for your application by leveraging the power of mobx without actually needing to know how observables, classes, and interceptors etc work.

The true potential of Mobx Quantum is that after defining what your store looks like, you can use it like any other javascript object \(including cyclic references\) and receive a bunch of other super powers for free.

[Documentation](https://ashconnell.gitbook.io/mobx-quantum/)

### Quick Start

Let's build a todo list react app with localStorage persistence and rehydration...

`yarn add mobx-quantum mobx-react mobx react react-dom`

Define a store:

```javascript
// store.js
import { model, value, createStore } from 'mobx-quantum'
import actions from './actions'

const Todo = model('Todo', {
  text: value.string(),
  done: value.boolean({ default: false })
})

const Store = model('Store', {
  todos: value.array({ of: value.ref({ model: Todo }), default: [] })
})

export default createStore(Store, {
  actions,
  snapshot: JSON.parse(localStorage.getItem('snapshot') || '{}'),
  onSnapshot: snapshot => localStorage.setItem('snapshot', JSON.parse(snapshot))
})
```

Define some actions for the store:

```javascript
// actions.js
function createTodo (text) {
  this.todos.push({ text })
}
export default { createTodo }
```

Create our todo list component:

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

Initialize the react app:

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

And there we have it!

## Powerful Reconciliation

A Mobx Quantum store is able to reconcile and ensure that only one instance of a model with the same id can exist in the store at any time - automatically! 

Take this example:

```javascript
// inserting the same todo in 2 places only results in 1 reference
store.todos.push({ id: 't1', name: 'Get Milk' })
store.selectedTodo = { id: 't1', name: 'Get Milk' }
console.log(store.selectedTodo === store.todos[0]) // true

// modifying the name updates the same reference anywhere in the store
store.selectedTodo.name = 'Get Milk And Bread'
console.log(store.selectedTodo.name === store.todos[0].name) // true

// if we were to fetch an updated todo from the backend, we can insert it anywhere
store.selectedTodo = { id: 't1', name: 'Get Everything' }
console.log(store.selectedTodo === store.todos[0]) // true

// or alternatively just insert it into the store
store.put({ id: 't1', name: 'Get Nothing' })
console.log(store.selectedTodo.name === 'Get Nothing') // true
```

```text
yarn
cd packages/mobx-quantum
yarn start
```

## Thanks

This library is very much inspired by some of the most amazing libraries in the community: [mobx](https://github.com/mobxjs/mobx), [mobx-state-tree](https://github.com/mobxjs/mobx-state-tree), [redux](https://github.com/reduxjs/redux), and [redux-saga](https://github.com/redux-saga/redux-saga). 

