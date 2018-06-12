# Overview

Mobx Quantum is a light-weight wrapper around Mobx 5 that aims to:

* Harness the power of Mobx observables without needing to know they exist
* Let you design a single-state atom for your app
* Automatically keep data normalized, but allow cyclical references in your code
* Output normalized snapshots for rehydration via localStorage/AsyncStorage etc

**Important**: this is currently a WIP and not ready for production \(yet!\)

## Powerful

One of the key features of Mobx Quantum is it's ability to reconcile and ensure only the most current version of a document is in the store at any time, automatically. Take this example:

```javascript
store.todos.push({ id: 't1', name: 'Get Milk' })
store.selectedTodo = 't1'
console.log(store.selectedTodo === store.todos[0]) // true
store.selectedTodo.name = 'Get Milk And Bread'
console.log(store.selectedTodo.name === store.todos[0].name) // true
store.selectedTodo = { id: 't1', name: 'Foobars' }
console.log(store.todos[0].name === 'Foobars') // true
```

## Installation

```bash
yarn add mobx-quantum
```



