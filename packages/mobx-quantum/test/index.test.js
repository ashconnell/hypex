import { configure, onReactionError } from 'mobx'
import { model, props, createStore } from '../src'

configure({ enforceActions: false })

const Todo = model('Todo', {
  id: props.id(),
  name: props.string(),
  done: props.boolean({ default: false }),
})

const Store = model('Store', {
  todoOne: props.ref({ model: Todo }),
  todoTwo: props.ref({ model: Todo }),
})

function newStore(snapshot) {
  return createStore(Store, {
    snapshot,
    // onChange: ({ js }) => console.log(js),
  })
}

test('create a new store', () => {
  const store = newStore()
  expect(store.todoOne).toBe(null)
  expect(store.todoTwo).toBe(null)
})

test('can link models using an id', () => {
  const store = newStore()
  store.todoOne = { id: '1', name: 'Todo #1' }
  expect(store.todoOne.name).toEqual('Todo #1')
  expect(store.todoOne.id).toEqual('1')
  store.todoTwo = { id: '1', name: 'Todo #1' }
  expect(store.todoTwo.name).toEqual('Todo #1')
  expect(store.todoTwo.id).toEqual('1')
  store.todoOne.done = true
  expect(store.todoOne.done).toEqual(true)
  expect(store.todoTwo.done).toEqual(true)
})

test('update all instances with the same id, by just inserting in one place', () => {
  const store = newStore()
  store.todoOne = store.todoTwo = { id: '1', name: 'Todo #1', done: false }
  store.todoTwo = { id: '1', name: 'Updated', done: true }
  expect(store.todoOne.name).toEqual('Updated')
  expect(store.todoOne.done).toEqual(true)
  expect(store.todoTwo.name).toEqual('Updated')
  expect(store.todoTwo.done).toEqual(true)
})

// TODO: automatic id resolution to model

test('can hydrate and snapshot', () => {
  const store = newStore({
    todoOne: { id: '1', name: 'Todo #1' },
  })
  expect(store._snapshot).toEqual({
    todoOne: '1',
    _instances: {
      '1': {
        id: '1',
        name: 'Todo #1',
        _id: '1',
        _type: 'Todo',
      },
    },
  })
})

// TODO: numbers cant be used as ids?
