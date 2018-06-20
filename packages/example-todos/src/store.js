import { model, value, createStore } from 'mobx-quantum'
import actions from './actions'
import processes from './processes'

const Todo = model('Todo', {
  id: value.id(),
  text: value.string(),
  complete: value.boolean({ default: false }),
})

const TodoList = model('TodoList', {
  id: value.id(),
  name: value.string(),
  todos: value.array({ of: value.ref({ model: () => Todo }), default: [] }),
  newTodo: value.string({ default: '' }),
  completed: value.virtual({
    value: function() {
      return this.todos.filter(todo => todo.complete).length
    },
  }),
})

const Route = model('Route', {
  name: value.string(),
  props: value.mixed(),
})

const Store = model('Store', {
  newListName: value.string({ default: '' }),
  todoLists: value.array({
    of: value.ref({ model: TodoList }),
  }),
  route: value.ref({ model: Route, default: { name: 'TodoLists' } }),
})

const store = createStore(Store, {
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
  processes,
})

export default store
