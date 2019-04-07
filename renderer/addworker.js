'use strict'

const { ipcRenderer } = require('electron')




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
  ipcRenderer.send('add-worker', [first_name.value + last_name.value, first_name.value,last_name.value, email.value, position.value, level.value ])

  // reset input
  first_name.value = ''
  last_name.value = ''
  email.value = ''
  position.value = ''
  level.value = '2'

})
