# Store

The store is a single tree of data. You define how it looks using `schemas`. Schemas help to reconcile the types of data you insert into your store.

{% code-tabs %}
{% code-tabs-item title="store.js" %}
```javascript
import { model, props, createStore } from 'mobx-quantum'
import actions from './actions'

const Todo = model('Todo', {
  text: types.string(),
  done: types.boolean({ default: false })
})

const Store = model('Store', {
  todos: types.array({ of: types.ref({ model: Todo }), default: [] })
})

export default createStore(Store, {
  snapshot: JSON.parse(localStorage.getItem('snapshot') || '{}'),
  onChange: ({ snapshot }) => localStorage.setItem('snapshot', JSON.parse(snapshot))
})
```
{% endcode-tabs-item %}
{% endcode-tabs %}



