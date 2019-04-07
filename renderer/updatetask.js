'use strict'

const { ipcRenderer } = require('electron')



ipcRenderer.on('task_data', (event, task) => {

  const task_name = document.getElementById('inputname')
  const task_description = document.getElementById('inputdescription')
  const task_deadline = document.getElementById('inputdeadline')

  task_name.value = task[0]
  task_name.name = task [0]
  task_description.value = task[2]
  task_deadline.value = task[1]

  })

document.getElementById('taskForm').addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()

  // input on the form
  const name = evt.target[0]

  const deadline = evt.target[1]
  const description = evt.target[2]

  ipcRenderer.send('update-task', [name.name, [name.value, deadline.value, description.value]])

})
