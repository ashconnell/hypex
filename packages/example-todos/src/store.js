import { model, props, createStore } from 'mobx-quantum'
import actions from './actions'

const Todo = model('Todo', {
  id: props.id(),
  text: props.string(),
  complete: props.boolean({ default: false }),
})

const TodoList = model('TodoList', {
  id: props.id(),
  name: props.string(),
  todos: props.array({ of: props.ref({ model: () => Todo }), default: [] }),
  newTodo: props.string({ default: '' }),
  completed: props.virtual({
    value: function() {
      return this.todos.filter(todo => todo.complete).length
    },
  }),
})

const Route = model('Route', {
  name: props.string(),
  props: props.mixed(),
})

const Store = model('Store', {
  newListName: props.string({ default: '' }),
  todoLists: props.array({
    of: props.ref({ model: TodoList }),
  }),
  route: props.ref({ model: Route, default: { name: 'TodoLists' } }),
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
