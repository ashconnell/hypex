import React from "react";
import { inject, observer } from "mobx-react";
import TodoLists from "./TodoLists";
import TodoList from "./TodoList";

const components = {
  TodoLists: TodoLists,
  TodoList: TodoList
};

const Router = ({ store }) => {
  console.log(store.route && store.route.name);
  if (!store.route) return null;
  const Route = components[store.route.name];
  return <Route {...store.route.props} />;
};

export default inject("store")(observer(Router));
