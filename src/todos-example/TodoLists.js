import React from 'react'
import { inject, observer } from 'mobx-react'

class TodoLists extends React.Component {
  componentDidMount() {
    const { store } = this.props
    if (!store.todoLists) {
      store.fetchTodoLists()
    }
  }

  render() {
    const { store } = this.props
    return (
      <div>
        <h1>Lists</h1>
        <form
          onSubmit={e => {
            e.preventDefault()
            store.createNewList()
          }}
        >
          <input
            type="text"
            placeholder="New List"
            value={store.newListName}
            onChange={e => store.setNewListName(e.target.value)}
          />
        </form>
        {store.todoLists &&
          store.todoLists.map(todoList => (
            <div
              key={todoList.id}
              onClick={() => store.routeTo('TodoList', { id: todoList.id })}
            >
              <p>
                <b>{todoList.name} </b>
                ({todoList.completed}/{todoList.todos.length})
                <span
                  onClick={e => {
                    e.stopPropagation()
                    store.removeTodoList(todoList.id)
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

export default inject('store')(observer(TodoLists))
