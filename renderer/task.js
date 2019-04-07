'use strict'

const { ipcRenderer } = require('electron')


const add_link = (e) => {
  const name  = document.getElementById('name').innerHTML

  ipcRenderer.send('add-link-to-task', [name + e.target.id, name, e.target.id] )
}

const delete_link = (e) => {
  const name  = document.getElementById('name').innerHTML
  ipcRenderer.send('delete-link-task', [e.target.id, name] )
}

ipcRenderer.on('task_data', (event, task) => {

  const task_name = document.getElementById('name')
  const task_description = document.getElementById('description')
  const task_deadline = document.getElementById('deadline')

  task_name.innerHTML = task[0][0]
  task_description.innerHTML = task[0][2]
  task_deadline.innerHTML = task[0][1]

  })


// on receive todos
ipcRenderer.on('workers', (event, worker) => {
  // get the todoList ul
  const wList = document.getElementById('WorkersList')

  // create html string
  const wItems = worker.reduce((html, w_) => {
    html += `<li id=${w_[0]} class="worker list-group-item list-group-item-action">${w_[2]}</li>`

    return html
  }, '')

  // set list html to the todo items
  wList.innerHTML = wItems

  // add click handlers to delete the clicked todo
  wList.querySelectorAll('.worker').forEach(item => {
    item.addEventListener('click', delete_link)
  })

})


document.getElementById('delete_task').addEventListener('click', () => {
  const name  = document.getElementById('name').innerHTML
  ipcRenderer.send('window-task-delete', name)
})


document.getElementById('update_task').addEventListener('click', () => {
  const name  = document.getElementById('name').innerHTML
  const deadline = document.getElementById('deadline').innerHTML
  const description = document.getElementById('description').innerHTML
  ipcRenderer.send('window-task-update', [name, deadline, description])
})




ipcRenderer.on('addworker', (event, workers) => {
  // get the todoList ul
  const todoList = document.getElementById('addWorkersList')

  // create html string
  const todoItems = workers.reduce((html, worker) => {
    html += `<li id=${worker} class="addworker list-group-item list-group-item-action">${worker}</li>`

    return html
  }, '')

  // set list html to the todo items
  todoList.innerHTML = todoItems

  // add click handlers to delete the clicked todo
  todoList.querySelectorAll('.addworker').forEach(item => {
    item.addEventListener('click', add_link)
  })
})
