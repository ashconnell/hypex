import React from "react";
import { inject, observer } from "mobx-react";
import BooksList from "./BooksList";
// import BookDetail from "./BookDetail";

const components = {
  BooksList: BooksList
  // BookDetail: BookDetail
};

const Router = ({ store }) => {
  console.log(store.route);
  if (!store.route) return null;
  const Route = components[store.route.name];
  return <Route {...store.route.props} />;
};

export default inject("store")(observer(Router));
