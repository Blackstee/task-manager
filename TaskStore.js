'use strict'

const Store = require('electron-store')

class TaskStore extends Store {
  constructor (settings) {
    super(settings)

    // initialize with todos or empty array
    this.tasks =  this.get('tasks') ||[]
  }

  saveTasks () {
    // save todos to JSON file
    this.set('tasks', this.tasks)

    // returning 'this' allows method chaining
    return this
  }

  getTasks () {
    // set object's todos to todos in JSON file
    this.tasks = this.get('tasks') || []

    return this
  }

  getTask (task_name) {

    const task = this.tasks.filter(t => t[0] == task_name)
    return task
  }

  checkTask (task){

    const tasks = this.tasks.filter(t => t[0] == task[0])
    return tasks
  }


  addTask (task) {

    if (this.checkTask(task).length == 0){
      this.tasks = [ ...this.tasks, task ]
    }
    return this.saveTasks()
  }

  deleteTask (task) {
    // filter out the target todo
    this.tasks = this.tasks.filter(t => t[0] !== task)

    return this.saveTasks()
  }
}

module.exports = TaskStore
