'use strict'

const { ipcRenderer } = require('electron')


ipcRenderer.on('worker_data', (event, worker) => {

  const worker_first_name = document.getElementById('inputfirstname')
  const worker_last_name = document.getElementById('inputlastname')
  const worker_email = document.getElementById('inputemail')
  const worker_position = document.getElementById('inputposition')
  const worker_level = document.getElementById('inputlevel')

  worker_first_name.value = worker[1]
  worker_first_name.name = worker[0]
  worker_last_name.value = worker[2]
  worker_email.value = worker[3]
  worker_position.value = worker[4]
  worker_level.value = worker[5]

  })


document.getElementById('workerForm').addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()

  // input on the form
  const first_name = evt.target[0]
  const last_name = evt.target[1]
  const email = evt.target[2]
  const position = evt.target[3]
  const level = evt.target[4]

  // send todo to main process
  // id is first name + last name
  ipcRenderer.send('update-worker', [first_name.name, [first_name.value + last_name.value, first_name.value,last_name.value, email.value, position.value, level.value] ])


})
