# Read Me

![mobx quantum](docs/.gitbook/assets/logo-text.png)

**Important**: this is currently a WIP and not ready for production \(yet!\)

Mobx Quantum is a state management library based on [Mobx](https://github.com/mobxjs/mobx). It provides a simple way to define a single state atom for your application, by leveraging the power of mobx without needing to know how observables, classes, and interceptors etc work.

The true potential of Mobx Quantum is that after defining what your store looks like, you can use it like any other javascript object \(including cyclic references\) and receive a bunch of other super powers for free.

[Quick Start](docs/quick-start.md) \| [Documentation](docs/models.md)

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

## Thanks

This library is very much inspired by some of the most amazing libraries in the community: [mobx](https://github.com/mobxjs/mobx), [mobx-state-tree](https://github.com/mobxjs/mobx-state-tree), [redux](https://github.com/reduxjs/redux), and [redux-saga](https://github.com/redux-saga/redux-saga).

