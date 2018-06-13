# Quick Start

## Install Dependencies

`yarn add mobx-quantum mobx-react mobx react react-dom`

## Define the store

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

## Define some actions for the store

```javascript
// actions.js
function createTodo (text) {
  this.todos.push({ text })
}
export default { createTodo }
```

## Create our todo list component

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

## Initialize the react app

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

