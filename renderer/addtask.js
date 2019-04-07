'use strict'

const { ipcRenderer } = require('electron')



document.getElementById('taskForm').addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()

  // input on the form
  const name = evt.target[0]
  const deadline = evt.target[1]
  const description = evt.target[2]


  // send todo to main process
//name goes as id to prevent the tasks with the same names
  ipcRenderer.send('add-task', [name.value, deadline.value, description.value])

  // reset input
  name.value = ''
  deadline.value = ''
  description.value = ''
})
