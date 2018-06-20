import { times } from 'lodash'
import { delay } from 'mobx-quantum'

export default store => ({
  fetchTodoLists: function*() {
    yield delay(500) // simulate async
    store.todoLists = [
      {
        id: 'tl1',
        name: 'Personal',
        todos: [{ id: 't1', text: 'Get milk', complete: false }],
      },
    ]

    yield delay(500) // simulate async
    store.todoLists.push({
      id: 'tl2',
      name: 'Foonar',
      todos: [
        't1',
        // { id: "t1", text: "Get milk v2", complete: true },
        { id: 't2', text: 'Get bread', complete: true },
      ],
    })

    yield delay(500) // simulate async
    var amount = 1000
    var action = `create ${amount} todos`
    console.time(action)
    let todos = []
    times(amount, i => {
      todos.push({ id: `gt${i}`, text: `Todo #${i}`, complete: false })
    })
    store.todoLists.push({
      id: 'tl3',
      name: 'Massive',
      todos,
    })
    console.timeEnd(action)
  },
})
