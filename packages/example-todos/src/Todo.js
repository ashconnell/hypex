import React from 'react'
import { inject, observer } from 'mobx-react'

const Todo = ({ state, todo }) => {
  return (
    <p onClick={() => state.action('toggleTodo', todo.id)}>
      <input type="checkbox" checked={todo.complete} readOnly />
      <span> {todo.text}</span>
    </p>
  )
}

export default inject('state')(observer(Todo))
