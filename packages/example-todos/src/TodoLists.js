import React from 'react'
import { inject, observer } from 'mobx-react'

class TodoLists extends React.Component {
  componentDidMount() {
    const { state } = this.props
    if (!state.todoLists) {
      state.action('fetchTodoLists')
    }
  }

  render() {
    const { state } = this.props
    return (
      <div>
        <h1>Lists</h1>
        <form
          onSubmit={e => {
            e.preventDefault()
            state.action('createNewList')
          }}
        >
          <input
            type="text"
            placeholder="New List"
            value={state.newListName}
            onChange={e => state.action('setNewListName', e.target.value)}
          />
        </form>
        {state.todoLists &&
          state.todoLists.map(todoList => (
            <div
              key={todoList.id}
              onClick={() =>
                state.action('routeTo', 'TodoList', { id: todoList.id })
              }
            >
              <p>
                <b>{todoList.name} </b>
                ({todoList.completed}/{todoList.todos.length})
                <span
                  onClick={e => {
                    e.stopPropagation()
                    state.action('removeTodoList', todoList.id)
                  }}
                >
                  {' X'}
                </span>
              </p>
            </div>
          ))}
      </div>
    )
  }
}

export default inject('state')(observer(TodoLists))
