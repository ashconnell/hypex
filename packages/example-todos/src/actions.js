import { times } from 'lodash'
import { flow, delay } from 'mobx-quantum'
import cuid from 'cuid'

const routeTo = store => (name, props) => {
  store.route = { name, props }
}

const toggleTodo = store => id => {
  const todo = store.get(id)
  todo.complete = !todo.complete
}

const fetchTodoLists = store =>
  flow(function*() {
    yield delay(500) // simulate async
    store.todoLists = [
      {
        id: 'tl1',
        name: 'Personal',
        todos: [{ id: 't1', text: 'Get milk', complete: false }],
        flags: ['lol', 'bars'],
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
  })

const createNewList = store => () => {
  console.log('createNewList')
  store.todoLists.unshift({
    id: cuid(),
    name: store.newListName,
  })
  store.newListName = ''
}

const setNewListName = store => name => {
  store.newListName = name
}

const setNewTodo = store => (todoListId, text) => {
  store.get(todoListId).newTodo = text
}

const removeTodoList = store => todoListId => {
  const todoList = store.get(todoListId)
  store.todoLists.remove(todoList)
}

const addTodo = store => (todoListId, text) => {
  const todoList = store.get(todoListId)
  todoList.todos.unshift({
    id: cuid(),
    text: todoList.newTodo,
  })
  todoList.newTodo = ''
}

export default {
  fetchTodoLists,
  toggleTodo,
  routeTo,
  setNewListName,
  createNewList,
  setNewTodo,
  addTodo,
  removeTodoList,
}
