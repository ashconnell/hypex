import React from "react";
import { inject, observer } from "mobx-react";
import Book from "./Book";

const BooksList = ({ store }) => {
  if (!store.books) {
    return <p>No Books</p>;
  }
  return (
    <div>
      <h1>Books</h1>
      {store.books.map(book => <Book key={book.id} book={book} />)}
    </div>
  );
};

export default inject("store")(observer(BooksList));
