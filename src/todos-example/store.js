import { schema, types, createStore } from "../mobx-quantum";
import { flow, delay } from "../mobx-quantum/effects";
import { toJS } from "mobx";

const Todo = schema("Todo", {
  id: types.id(),
  text: types.string(),
  complete: types.boolean({ default: false })
});

const TodoList = schema("TodoList", {
  id: types.id(),
  name: types.string(),
  todos: types.array({ of: types.model({ schema: () => Todo }), default: [] }),
  tags: types.array({ of: types.string(), default: [] })
});

const Route = schema("Route", {
  name: types.string(),
  props: types.mixed()
});

const Store = schema("Store", {
  todoLists: types.array({
    of: types.model({ schema: TodoList }),
    default: []
  }),
  route: types.model({ schema: Route, default: { name: "TodoLists" } })
});

const routeTo = store => (name, props) => {
  console.log("routeTo", toJS(store), name, props);
  store.route = { name, props };
};

const toggleTodo = store => id => {
  const todo = store.get(id);
  todo.complete = !todo.complete;
};

const fetchTodoLists = store =>
  flow(function*() {
    // console.log("g", store.todoLists.slice());
    yield delay(500); // simulate async
    store.todoLists = [
      {
        id: "tl1",
        name: "Personal",
        todos: [{ id: "t1", text: "Get milk", complete: false }],
        flags: ["lol", "bars"]
      }
    ];
    // console.log("g", store.todoLists.slice());
    yield delay(500); // simulate async
    // store.todoLists[0].flags.push("yum");
    store.todoLists.push({
      id: "tl2",
      name: "Foonar",
      todos: [
        "t1",
        // { id: "t1", text: "Get milk v2", complete: true },
        { id: "t2", text: "Get bread", complete: true }
      ]
    });
    // yield delay(1000); // simulate async
    // var amount = 10000;
    // var action = `create ${amount} todos`;
    // console.time(action);
    // let todos = [];
    // times(amount, i => {
    //   todos.push({ id: `gt${i}`, text: `Todo #${i}`, complete: false });
    // });
    // store.todoLists.push({
    //   id: "tl3",
    //   name: "Massive",
    //   todos
    // });
    // console.timeEnd(action);
    // console.log("g", store.todoLists.slice());
  });

const store = createStore(Store, {
  // snapshot: JSON.parse(localStorage.getItem("snapshot") || "{}"),
  // data: {
  // ...
  // },
  onSnapshot: snapshot => {
    console.log("snapshot", snapshot);
    // localStorage.setItem("snapshot", JSON.stringify(snapshot));
  },
  actions: {
    fetchTodoLists,
    routeTo,
    toggleTodo
  }
});

export default store;
