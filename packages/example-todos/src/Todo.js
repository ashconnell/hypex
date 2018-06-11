import React from 'react'
import { inject, observer } from 'mobx-react'

const Todo = ({ store, todo }) => {
  return (
    <p onClick={() => store.toggleTodo(todo.id)}>
      <input type="checkbox" checked={todo.complete} readOnly />
      <span> {todo.text}</span>
    </p>
  )
}

export default inject('store')(observer(Todo))
