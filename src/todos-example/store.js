import { schema, types, createStore } from '../mobx-quantum'
import actions from './actions'

const Todo = schema('Todo', {
  id: types.id(),
  text: types.string(),
  complete: types.boolean({ default: false }),
})

const TodoList = schema('TodoList', {
  id: types.id(),
  name: types.string(),
  todos: types.array({ of: types.model({ schema: () => Todo }), default: [] }),
  newTodo: types.string({ default: '' }),
  completed: types.virtual({
    value: function() {
      return this.todos.filter(todo => todo.complete).length
    },
  }),
})

const Route = schema('Route', {
  name: types.string(),
  props: types.mixed(),
})

const Store = schema('Store', {
  newListName: types.string({ default: '' }),
  todoLists: types.array({
    of: types.model({ schema: TodoList }),
  }),
  route: types.model({ schema: Route, default: { name: 'TodoLists' } }),
})

const store = createStore(Store, {
  snapshot() {
    const snapshot = JSON.parse(localStorage.getItem('snapshot') || '{}')
    console.log('loaded snapshot', snapshot)
    return snapshot
  },
  onChange: ({ snapshot, js }) => {
    console.log('onChange', js)
    localStorage.setItem('snapshot', JSON.stringify(snapshot))
  },
  actions,
})

export default store
