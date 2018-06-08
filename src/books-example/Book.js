import React from "react";
import { inject, observer } from "mobx-react";

const Book = ({ store, book }) => {
  return (
    <div>
      <h3>{book.title}</h3>
      <p>Author:{book.author.name}</p>
    </div>
  );
};

export default inject("store")(observer(Book));
