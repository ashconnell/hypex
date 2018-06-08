import React from "react";
import { inject, observer } from "mobx-react";

const Todo = ({ store, todo }) => {
  return (
    <p onClick={() => store.toggleTodo(todo.id)}>
      {todo.text}
      {todo.complete && " (done)"}
    </p>
  );
};

export default inject("store")(observer(Todo));
