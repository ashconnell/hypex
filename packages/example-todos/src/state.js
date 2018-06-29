import { types, createState } from 'hypex'
import actions from './actions'

const Todo = types.model({
  name: 'Todo',
  props: {
    id: types.id(),
    text: types.string(),
    complete: types.boolean({ default: false }),
  },
})

const TodoList = types.model({
  name: 'TodoList',
  props: {
    id: types.id(),
    name: types.string(),
    todos: types.array({ of: types.ref({ model: () => Todo }), default: [] }),
    newTodo: types.string({ default: '' }),
    completed: types.virtual({
      get: function() {
        return this.todos.filter(todo => todo.complete).length
      },
    }),
  },
})

const Route = types.model({
  name: 'Route',
  props: {
    name: types.string(),
    props: types.object(),
  },
})

const App = types.model({
  name: 'App',
  props: {
    newListName: types.string({ default: '' }),
    todoLists: types.array({
      of: types.ref({ model: TodoList }),
    }),
    route: types.ref({ model: Route, default: { name: 'TodoLists' } }),
  },
})

const state = createState(App, {
  snapshot() {
    const snapshot = JSON.parse(localStorage.getItem('snapshot') || '{}')
    console.log('loaded snapshot', snapshot)
    return snapshot
  },
  onSnapshot: snapshot => {
    localStorage.setItem('snapshot', JSON.stringify(snapshot))
  },
  onChange: data => {
    console.log('change', data)
  },
  actions,
})

export default state
