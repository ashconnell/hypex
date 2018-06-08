import React from "react";
import { Provider } from "mobx-react";
import Router from "./Router";
import store from "./store";

const App = () => (
  <Provider store={store}>
    <Router />
  </Provider>
);

export default App;
