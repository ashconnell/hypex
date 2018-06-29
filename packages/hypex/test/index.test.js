import { configure } from 'mobx'
import { types, createState } from '../src'

configure({ enforceActions: false })

const Todo = types.model({
  name: 'Todo',
  props: {
    id: types.id(),
    name: types.string(),
    done: types.boolean({ default: false }),
  },
})

const Store = types.model({
  name: 'Store',
  props: {
    todoOne: types.ref({ model: Todo }),
    todoTwo: types.ref({ model: Todo }),
  },
})

function newState(snapshot) {
  return createState(Store, {
    snapshot,
    // onChange: ({ js }) => console.log(js),
  })
}

test('create a new state', () => {
  const state = newState()
  expect(state.todoOne).toBe(null)
  expect(state.todoTwo).toBe(null)
})

test('can link models using an id', () => {
  const state = newState()
  state.todoOne = { id: '1', name: 'Todo #1' }
  expect(state.todoOne.name).toEqual('Todo #1')
  expect(state.todoOne.id).toEqual('1')
  state.todoTwo = { id: '1', name: 'Todo #1' }
  expect(state.todoTwo.name).toEqual('Todo #1')
  expect(state.todoTwo.id).toEqual('1')
  state.todoOne.done = true
  expect(state.todoOne.done).toEqual(true)
  expect(state.todoTwo.done).toEqual(true)
})

test('update all instances with the same id, by just inserting in one place', () => {
  const state = newState()
  state.todoOne = state.todoTwo = { id: '1', name: 'Todo #1', done: false }
  state.todoTwo = { id: '1', name: 'Updated', done: true }
  expect(state.todoOne.name).toEqual('Updated')
  expect(state.todoOne.done).toEqual(true)
  expect(state.todoTwo.name).toEqual('Updated')
  expect(state.todoTwo.done).toEqual(true)
})

// TODO: automatic id resolution to model

test('can hydrate and snapshot', () => {
  const state = newState({
    todoOne: { id: '1', name: 'Todo #1' },
  })
  expect(state._snapshot).toEqual({
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
