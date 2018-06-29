import cuid from 'cuid'
import { times } from 'lodash'
import { delay } from 'hypex'
import { flow } from 'mobx'

const actions = {
  routeTo: function(state, name, props) {
    state.route = { name, props }
  },

  toggleTodo: function(state, id) {
    const todo = state.get(id)
    todo.complete = !todo.complete
  },

  createNewList: function(state) {
    console.log('createNewList')
    state.todoLists.unshift({
      id: cuid(),
      name: state.newListName,
    })
    state.newListName = ''
  },

  setNewListName: function(state, name) {
    state.newListName = name
  },

  setNewTodo: function(state, todoListId, text) {
    state.get(todoListId).newTodo = text
  },

  removeTodoList: function(state, todoListId) {
    const todoList = state.get(todoListId)
    state.todoLists.remove(todoList)
  },

  addTodo: function(state, todoListId, text) {
    const todoList = state.get(todoListId)
    todoList.todos.unshift({
      id: cuid(),
      text: todoList.newTodo,
    })
    todoList.newTodo = ''
  },

  fetchTodoLists: flow(function*(state) {
    yield delay(500) // simulate async
    state.todoLists = [
      {
        id: 'tl1',
        name: 'Personal',
        todos: [{ id: 't1', text: 'Get milk', complete: false }],
      },
    ]

    yield delay(500) // simulate async
    state.todoLists.push({
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
    state.todoLists.push({
      id: 'tl3',
      name: 'Massive',
      todos,
    })
    console.timeEnd(action)
  }),
}

export default actions
