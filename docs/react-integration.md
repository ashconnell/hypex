# React Integration

You can integrate a Mobx Quantum store into a react app using [mobx-react](https://github.com/mobxjs/mobx-react):

## Provider

{% code-tabs %}
{% code-tabs-item title="index.js" %}
```javascript
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
{% endcode-tabs-item %}
{% endcode-tabs %}

## Inject and Observe

{% code-tabs %}
{% code-tabs-item title="Todos.js" %}
```javascript
import { inject, observe } from 'mobx-react'

const Todos = (state) => (
  <h1>Todos</h1>
  <form onSubmit={(e) => { e.preventDefault(); state.addTodo(this.text) }}>
    <input type='text' placeholder='Add todo' onChange={(e) => this.text = e.target.value}/>
  </form>
  {state.todos.map(todo => {
    <p>{todo.text}</p>
  })}
)

export default inject('state')(observer(Todos))
```
{% endcode-tabs-item %}
{% endcode-tabs %}

