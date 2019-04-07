'use strict'

const { ipcRenderer } = require('electron')


const add_link = (e) => {
  const full_name  = document.getElementById('first_name').innerHTML + document.getElementById('last_name').innerHTML

  ipcRenderer.send('add-link-to-worker', [e.target.id + full_name, e.target.id, full_name] )
}

const delete_link = (e) => {
  const full_name  = document.getElementById('first_name').innerHTML + document.getElementById('last_name').innerHTML

  ipcRenderer.send('delete-link-worker', [e.target.id + full_name, full_name] )
}

// on receive todos
ipcRenderer.on('worker_data', (event, worker) => {
  // get the todoList ul
  const worker_first_name = document.getElementById('first_name')
  const worker_last_name = document.getElementById('last_name')
  const worker_email = document.getElementById('email')
  const worker_position = document.getElementById('position')
  const worker_level = document.getElementById('level')


  worker_first_name.innerHTML = worker[0][1]
  worker_last_name.innerHTML = worker[0][2]
  worker_email.innerHTML = worker[0][3]
  worker_position.innerHTML = worker[0][4]
  worker_level.innerHTML = worker[0][5]


})


document.getElementById('delete_worker').addEventListener('click', () => {
  const full_name  = document.getElementById('first_name').innerHTML + document.getElementById('last_name').innerHTML
  ipcRenderer.send('window-worker-delete', full_name)
})

document.getElementById('update_worker').addEventListener('click', () => {
  const full_name  = document.getElementById('first_name').innerHTML + document.getElementById('last_name').innerHTML
  const first_name = document.getElementById('first_name').innerHTML
  const last_name = document.getElementById('last_name').innerHTML
  const email = document.getElementById('email').innerHTML
  const position = document.getElementById('position').innerHTML
  const level = document.getElementById('level').innerHTML
  ipcRenderer.send('window-worker-update', [full_name, first_name, last_name, email, position, level])
})

ipcRenderer.on('tasks', (event, todos) => {
  // get the todoList ul
  const todoList = document.getElementById('TasksList')

  // create html string
  const todoItems = todos.reduce((html, todo) => {
    html += `

    <li id=${todo[1]} class="task list-group-item list-group-item-action col-xs-6">${todo[1]}

    </li>`

    return html
  }, '')

  // set list html to the todo items
  todoList.innerHTML = todoItems

  // add click handlers to delete the clicked todo
  todoList.querySelectorAll('.task').forEach(item => {
    item.addEventListener('click', delete_link)
  })
})





ipcRenderer.on('addtask', (event, tasks) => {
  // get the todoList ul
  const todoList = document.getElementById('addTasksList')

  // create html string
  const todoItems = tasks.reduce((html, task) => {
    html += `<li id=${task} class="addtask list-group-item list-group-item-action">${task}</li>`

    return html
  }, '')

  // set list html to the todo items
  todoList.innerHTML = todoItems

  // add click handlers to delete the clicked todo
  todoList.querySelectorAll('.addtask').forEach(item => {
    item.addEventListener('click', add_link)
  })
})
