import React from "react";
import { inject, observer } from "mobx-react";
import Todo from "./Todo";

const TodoList = ({ store, id }) => {
  const todoList = store.get(id);
  console.log(todoList);
  if (!todoList) {
    return <p>No Todo List</p>;
  }
  return (
    <div>
      <p onClick={() => store.routeTo("TodoLists")}>Back</p>
      <h1>{todoList.name}</h1>
      <p>{todoList.tags.join(",")}</p>
      {todoList.todos.map(todo => <Todo key={todo.id} todo={todo} />)}
    </div>
  );
};

export default inject("store")(observer(TodoList));
