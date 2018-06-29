# Quick Start

## Overview

Let's build a simple Todos app with local-storage persistence and hydration.

You can also jump straight into playing around with a live example on [this codesandbox](https://codesandbox.io/s/64647p41mk)

## 1. Install Dependencies

`yarn add hypex mobx-react mobx react react-dom`

## 2. Define the store

```javascript
// state.js
import { types, createState } from 'hypex'
import actions from './actions'

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

export default createState(App, {
  actions,
  snapshot: JSON.parse(localStorage.getItem('snapshot') || '{}'),
  onSnapshot: snapshot => localStorage.setItem('snapshot', JSON.parse(snapshot))
})
```

## 3. Define some actions for your state

```javascript
// actions.js
function addTodo (state, text) {
  state.todos.push({ text })
}
export default { addTodo }
```

## 4. Create our Todos component

```javascript
// Todos.js
import { inject, observe } from 'mobx-react'

const Todos = ({ state }) => (
  <h1>Todos</h1>
  <form onSubmit={(e) => { e.preventDefault(); state.action('addTodo', this.text) }}>
    <input type='text' placeholder='Add todo' onChange={(e) => this.text = e.target.value}/>
  </form>
  {state.todos.map(todo => {
    <p>{todo.text}</p>
  })}
)

export default inject('state')(observer(Todos))
```

## 5. Initialize the React app

```javascript
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react'
import Todos from './Todos';
import state from './state'

const App = () => (
  <Provider state={state}>
    <Todos/>
  </Provider>
)

ReactDOM.render(<App />, document.getElementById('root'));
```

And there we have it!

