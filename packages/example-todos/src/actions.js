import { times } from 'lodash'
import { delay } from 'mobx-quantum'
import { flow } from 'mobx'
import cuid from 'cuid'

export default store => ({
  routeTo(name, props) {
    store.route = { name, props }
  },

  toggleTodo(id) {
    const todo = store.get(id)
    todo.complete = !todo.complete
  },

  fetchTodoLists: flow(function*() {
    yield delay(500) // simulate async
    store.todoLists = [
      {
        id: 'tl1',
        name: 'Personal',
        todos: [{ id: 't1', text: 'Get milk', complete: false }],
      },
    ]

    yield delay(500) // simulate async
    store.todoLists.push({
      id: 'tl2',
      name: 'Foonar',
      todos: [
        't1',
        // { id: "t1", text: "Get milk v2", complete: true },
        { id: 't2', text: 'Get bread', complete: true },
      ],
    })

    yield delay(500) // simulate async
    var amount = 1000
    var action = `create ${amount} todos`
    console.time(action)
    let todos = []
    times(amount, i => {
      todos.push({ id: `gt${i}`, text: `Todo #${i}`, complete: false })
    })
    store.todoLists.push({
      id: 'tl3',
      name: 'Massive',
      todos,
    })
    console.timeEnd(action)
  }),

  createNewList() {
    console.log('createNewList')
    store.todoLists.unshift({
      id: cuid(),
      name: store.newListName,
    })
    store.newListName = ''
  },

  setNewListName(name) {
    store.newListName = name
  },

  setNewTodo(todoListId, text) {
    store.get(todoListId).newTodo = text
  },

  removeTodoList(todoListId) {
    const todoList = store.get(todoListId)
    store.todoLists.remove(todoList)
  },

  addTodo(todoListId, text) {
    const todoList = store.get(todoListId)
    todoList.todos.unshift({
      id: cuid(),
      text: todoList.newTodo,
    })
    todoList.newTodo = ''
  },
})
