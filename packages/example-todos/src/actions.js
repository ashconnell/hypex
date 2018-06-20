import cuid from 'cuid'

export default store => ({
  routeTo(name, props) {
    store.route = { name, props }
  },

  toggleTodo(id) {
    const todo = store.get(id)
    todo.complete = !todo.complete
  },

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
