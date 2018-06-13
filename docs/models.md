# Models

In Mobx Quantum, everything in your store is defined by a model. A model is a definition of what something looks like and what properties it has. A model can define data you'll receive from the backend, a route in your router, the state of a piece of UI etc.

You create models by specifying a name and the properties your model will have.

```javascript
import { model, value } from 'mobx-quantum'

const Todo = model('Todo', {
    id: value.id(),
    text: value.string(),
    done: value.boolean()
})
```

By specifying what your models looks like up front, Mobx Quantum is able to provide super powers for managing the state of your application.

