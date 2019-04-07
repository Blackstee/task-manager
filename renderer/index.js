'use strict'

const { ipcRenderer } = require('electron')

// delete todo by its text value ( used below in event listener)
//const deleteTodo = (e) => {
//  ipcRenderer.send('delete-todo', e.target.textContent)
//}


const moreInfoWorker = (e) => {
  ipcRenderer.send('window-worker-more', e.target.id)
}


const moreInfoTask = (e) => {
  ipcRenderer.send('window-task-more', e.target.id)
}
// create add todo window button
document.getElementById('add_worker').addEventListener('click', () => {
  ipcRenderer.send('add-worker-window')
})


document.getElementById('add_task').addEventListener('click', () => {
  ipcRenderer.send('add-task-window')
})


// on receive todos
ipcRenderer.on('workers', (event, workers) => {
  // get the todoList ul
  const todoList = document.getElementById('WorkersList')

  // create html string
  const todoItems = workers.reduce((html, worker) => {
    html += `<li id=${worker[0]} class="worker list-group-item list-group-item-action">${worker[1]} ${worker[2]}</li>`

    return html
  }, '')

  // set list html to the todo items
  todoList.innerHTML = todoItems

  // add click handlers to delete the clicked todo
  todoList.querySelectorAll('.worker').forEach(item => {
    item.addEventListener('click', moreInfoWorker)
  })
})


ipcRenderer.on('tasks', (event, tasks) => {
  // get the todoList ul
  const todoList = document.getElementById('TasksList')

  // create html string
  const todoItems = tasks.reduce((html, task) => {
    html += `<li id=${task[0]} class="task list-group-item list-group-item-action">${task[0]}
    
    </li>`

    return html
  }, '')

  // set list html to the todo items
  todoList.innerHTML = todoItems

  // add click handlers to delete the clicked todo
  todoList.querySelectorAll('.task').forEach(item => {
    item.addEventListener('click', moreInfoTask)
  })
})
