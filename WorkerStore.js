'use strict'

const Store = require('electron-store')

class WorkerStore extends Store {
  constructor (settings) {
    super(settings)

    // initialize with workers or empty array
    this.workers = this.get('workers') || []
  }

  saveWorkers () {
    // save workers to JSON file
    this.set('workers', this.workers)

    // returning 'this' allows method chaining
    return this
  }

  getWorkers () {
    // set object's todos to todos in JSON file
    this.workers = this.get('workers') || []

    return this
  }


  getWorker (worker_full_name) {
    // set object's todos to todos in JSON file
    const worker = this.workers.filter(t => t[0] == worker_full_name)

    return worker
  }

  checkWorker (worker){

    const workers = this.workers.filter(t => t[0] == worker[0])
    return workers
  }

  addWorker (worker) {
    // merge the existing todos with the new todo
    if (this.checkWorker(worker).length == 0){
      this.workers = [ ...this.workers, worker ]
    }

    return this.saveWorkers()
  }

  deleteWorker (worker) {
    // filter out the target todo
    console.log("here is worker full name", typeof worker)

    this.workers = this.workers.filter(t => t[0] !== worker)

    return this.saveWorkers()
  }
}

module.exports = WorkerStore
