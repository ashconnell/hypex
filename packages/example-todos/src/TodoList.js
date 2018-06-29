import React from 'react'
import { inject, observer } from 'mobx-react'
import Todo from './Todo'

const TodoList = ({ state, id }) => {
  const todoList = state.get(id)
  if (!todoList) {
    return <p>No Todo List</p>
  }
  return (
    <div>
      <p onClick={() => state.action('routeTo', 'TodoLists')}>Back</p>
      <h1>{todoList.name}</h1>
      <form
        onSubmit={e => {
          e.preventDefault()
          state.action('addTodo', todoList.id, todoList.newTodo)
        }}
      >
        <input
          type="text"
          placeholder="New Todo"
          value={todoList.newTodo}
          onChange={e =>
            state.action('setNewTodo', todoList.id, e.target.value)
          }
        />
      </form>
      {todoList.todos.map(todo => <Todo key={todo.id} todo={todo} />)}
    </div>
  )
}

export default inject('state')(observer(TodoList))
