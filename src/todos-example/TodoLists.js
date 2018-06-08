import React from "react";
import { inject, observer } from "mobx-react";

class TodoLists extends React.Component {
  componentDidMount() {
    const { store } = this.props;
    store.fetchTodoLists();
  }

  render() {
    const { store } = this.props;
    return (
      <div>
        <h1>Lists</h1>
        {store.todoLists.map(todoList => (
          <div
            key={todoList.id}
            onClick={() => store.routeTo("TodoList", { id: todoList.id })}
          >
            <h3>{todoList.name}</h3>
            <p>{todoList.todos.length} todos</p>
          </div>
        ))}
      </div>
    );
  }
}

export default inject("store")(observer(TodoLists));
