import { configure } from 'mobx'
import { types, createState } from '../src'

configure({ enforceActions: false })

test('can create a state with an enum value', () => {
  const State = types.model({
    name: 'State',
    props: {
      state: types.enum({ enums: ['live', 'draft'] }),
    },
  })
  const state = createState(State)
  expect(state).toBeDefined()
})

test('can set a default value', () => {
  const State = types.model({
    name: 'State',
    props: {
      state: types.enum({
        enums: ['live', 'draft'],
        default: 'live',
      }),
    },
  })
  const state = createState(State)
  expect(state.state).toEqual('live')
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
  const State = types.model({
    name: 'State',
    props: {
      state: types.enum({
        enums: ['live', 'draft'],
        default: 'live',
      }),
    },
  })
  const state = createState(State)
  state.state = 'live'
  expect(state.state).toEqual('live')
})

test('cant set an invalid enum value', () => {
  const State = types.model({
    name: 'State',
    props: {
      state: types.enum({ enums: ['live', 'draft'] }),
    },
  })
  const state = createState(State)
  expect(() => (state.state = 'published')).toThrow()
})
