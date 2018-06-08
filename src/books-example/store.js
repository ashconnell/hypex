import { schema, types, createStore } from "../mobx-quantum";

const Author = schema("Author", {
  id: types.id(),
  name: types.string(),
  books: types.array({ of: types.model({ schema: () => Book }), default: [] })
});

const Book = schema("Book", {
  id: types.id(),
  title: types.string(),
  author: types.model({ schema: Author })
});

const Route = schema("Route", {
  name: types.string(),
  props: types.mixed()
});

const Store = schema("Store", {
  authors: types.array({ of: types.model({ schema: Author }), default: [] }),
  books: types.array({ of: types.model({ schema: Book }), default: [] }),
  route: types.model({ schema: Route, default: { name: "BooksList" } })
});

const snapshot = {
  authors: [
    { id: "a1", name: "Author 1", books: ["b1", "b2"] },
    { id: "a2", name: "Author 2", books: ["b3"] }
  ],
  books: [
    { id: "b1", title: "Book 1", author: "a1" },
    { id: "b2", title: "Book 2", author: "a1" },
    { id: "b3", title: "Book 3", author: "a2" }
  ]
};

export default createStore(Store, {
  snapshot,
  // snapshot: JSON.parse(localStorage.getItem("snapshot") || "{}"),
  onSnapshot: snapshot => console.log("snapshot", snapshot)
  // onSnapshot: snapshot => {
  //   console.log("snapshot", snapshot);
  //   localStorage.setItem("snapshot", JSON.stringify(snapshot));
  // }
  // actions
});
