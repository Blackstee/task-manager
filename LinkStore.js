'use strict'

const Store = require('electron-store')

class LinkStore extends Store {
  constructor (settings) {
    super(settings)

    // initialize with todos or empty array
    this.links = this.get('links') ||[]

  }

  saveLinks () {
    // save todos to JSON file
    this.set('links', this.links)

    // returning 'this' allows method chaining
    return this
  }

  getLinks () {
    // set object's todos to todos in JSON file
    this.links = this.get('links') || []

    return this
  }

  getLinks_by_task (task_name) {
    // set object's todos to todos in JSON file
    const links = this.links.filter(t => t[1] == task_name)
    return links
  }


  getLinks_by_worker (worker_name) {
    // set object's todos to todos in JSON file
    const links = this.links.filter(t => t[2] == worker_name)
    return links
  }

  checkLink (link){

    const links = this.links.filter(t => t[0] == link[0])
    return links
  }


  addLink (link) {
    console.log (this.checkLink(link).length)
    if (this.checkLink(link).length == 0){
      this.links = [ ...this.links, link ]
    }
    return this.saveLinks()
  }

  deleteLink (link_name) {

    this.links = this.links.filter(t => t[0] != link_name)
    return this.saveLinks()
  }

  deleteLink_by_task (task_name) {

    this.links = this.links.filter(t => t[1] != task_name)
    return this.saveLinks()
  }

  deleteLink_by_worker (worker_full_name) {

    this.links = this.links.filter(t => t[2] != worker_full_name)
    return this.saveLinks()
  }
}

module.exports = LinkStore
