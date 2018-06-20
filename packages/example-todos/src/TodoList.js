import React from 'react'
import { inject, observer } from 'mobx-react'
import Todo from './Todo'

const TodoList = ({ store, id }) => {
  const todoList = store.get(id)
  if (!todoList) {
    return <p>No Todo List</p>
  }
  return (
    <div>
      <p onClick={() => store.action('routeTo', 'TodoLists')}>Back</p>
      <h1>{todoList.name}</h1>
      <form
        onSubmit={e => {
          e.preventDefault()
          store.action('addTodo', todoList.id, todoList.newTodo)
        }}
      >
        <input
          type="text"
          placeholder="New Todo"
          value={todoList.newTodo}
          onChange={e =>
            store.action('setNewTodo', todoList.id, e.target.value)
          }
        />
      </form>
      {todoList.todos.map(todo => <Todo key={todo.id} todo={todo} />)}
    </div>
  )
}

export default inject('store')(observer(TodoList))
