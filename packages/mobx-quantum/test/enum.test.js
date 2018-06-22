import { configure } from 'mobx'
import { types, createStore } from '../src'

configure({ enforceActions: false })

test('can create a store with an enum value', () => {
  const Store = types.model({
    name: 'Store',
    props: {
      state: types.enum({ enums: ['live', 'draft'] }),
    },
  })
  const store = createStore(Store)
  expect(store).toBeDefined()
})

test('can set a default value', () => {
  const Store = types.model({
    name: 'Store',
    props: {
      state: types.enum({
        enums: ['live', 'draft'],
        default: 'live',
      }),
    },
  })
  const store = createStore(Store)
  expect(store.state).toEqual('live')
})

test('cant set an invalid default value', () => {
  expect(() => {
    types.enum({
      enums: ['live', 'draft'],
      default: 'published',
    })
  }).toThrow()
})

test('can set a valid enum value', () => {
  const Store = types.model({
    name: 'Store',
    props: {
      state: types.enum({
        enums: ['live', 'draft'],
        default: 'live',
      }),
    },
  })
  const store = createStore(Store)
  store.state = 'live'
  expect(store.state).toEqual('live')
})

test('cant set an invalid enum value', () => {
  const Store = types.model({
    name: 'Store',
    props: {
      state: types.enum({ enums: ['live', 'draft'] }),
    },
  })
  const store = createStore(Store)
  expect(() => (store.state = 'published')).toThrow()
})
