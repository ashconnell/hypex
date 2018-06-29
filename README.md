# Read Me

## HypeX

**Important**: this is currently a WIP and not ready for production \(yet!\)

HypeX is a state management library based on [Mobx](https://github.com/mobxjs/mobx). It provides a simple way to define a single state atom for your application, by leveraging the power of mobx without needing to know how observables  work.

The true potential of HypeX is that after defining what your state looks like, you can use it like any other javascript object \(including cyclic references\) and receive a bunch of other super powers for free.

[Quick Start](https://ashconnell.gitbook.io/mobx-quantum/quick-start) \| [Documentation](https://ashconnell.gitbook.io/mobx-quantum)

## Powerful Reconciliation

HypeX state is able to reconcile and ensure that only one instance of a model with the same id can exist in the state at any time - automatically!

Take this example:

```javascript
// inserting the same todo in 2 places only results in 1 reference
state.todos.push({ id: 't1', name: 'Get Milk' })
state.selectedTodo = { id: 't1', name: 'Get Milk' }
console.log(state.selectedTodo === state.todos[0]) // true

// modifying the name updates the same reference anywhere in the state
state.selectedTodo.name = 'Get Milk And Bread'
console.log(state.selectedTodo.name === state.todos[0].name) // true

// if we were to fetch an updated todo from the backend, we can insert it anywhere
state.selectedTodo = { id: 't1', name: 'Get Everything' }
console.log(state.selectedTodo === state.todos[0]) // true

// or alternatively just insert it into the state
state.put({ id: 't1', name: 'Get Nothing' })
console.log(state.selectedTodo.name === 'Get Nothing') // true
```

## Thanks

This library is very much inspired by some of the most amazing libraries in the community: [mobx](https://github.com/mobxjs/mobx), [mobx-state-tree](https://github.com/mobxjs/mobx-state-tree), [redux](https://github.com/reduxjs/redux), and [redux-saga](https://github.com/redux-saga/redux-saga).

