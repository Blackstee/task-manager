'use strict'

const path = require('path')
const { app, ipcMain } = require('electron')
const Store = require('electron-store');
const _ = require("underscore");


const Window = require('./Window')
const TaskStore = require('./TaskStore')
const WorkerStore = require('./WorkerStore')
const LinkStore = require('./LinkStore')

require('electron-reload')(__dirname)

// create a new todo store name "Todos Main"
const tasksData = new TaskStore({ name: 'Task Main' })

const workersData = new WorkerStore({ name: 'Workers Main' })

const linksData = new LinkStore({name: 'Links Main'})


function main () {
  // todo list window
  let mainWindow = new Window({
    file: path.join('renderer', 'index.html')
  })

  // add todo window
  let addWorkerWindow

  let addTaskWindow

  let workerWindow

  let taskWindow

  let workerupdateWindow

  let taskupdateWindow

  // TODO: put these events into their own file

  // initialize with todos
  mainWindow.once('show', () => {

    mainWindow.webContents.send('workers', workersData.workers)
    mainWindow.webContents.send('tasks', tasksData.tasks)
    const store = new Store();
    store.set('links', {'cdhsjv':{'name':'vasya', 'full_name': "gfchgvjh"}});


  })

  // create add todo window
  ipcMain.on('add-worker-window', () => {
    // if addTodoWin does not already exist
    if (!addWorkerWindow) {
      // create a new add todo window
      addWorkerWindow = new Window({
        file: path.join('renderer', 'addworker.html'),
        width: 800,
        height: 350,
        // close with the main window
        parent: mainWindow
      })

      // cleanup
      addWorkerWindow.on('closed', () => {
        addWorkerWindow = null
      })
    }
  })


  // create add todo window
  ipcMain.on('add-task-window', () => {
    // if addTodoWin does not already exist
    if (!addTaskWindow) {
      // create a new add todo window
      addTaskWindow = new Window({
        file: path.join('renderer', 'addtask.html'),
        width: 800,
        height: 400,
        // close with the main window
        parent: mainWindow
      })

      // cleanup
      addTaskWindow.on('closed', () => {
        addTaskWindow = null
      })
    }
  })

  // add-todo from add todo window
  ipcMain.on('add-worker', (event, worker) => {
    const updatedWorkers = workersData.addWorker(worker).workers
    console.log( updatedWorkers)
    mainWindow.send('workers', updatedWorkers)
  })


  ipcMain.on('add-task', (event, task) => {
    const updatedTasks = tasksData.addTask(task).tasks
    console.log( updatedTasks)
    mainWindow.send('tasks', updatedTasks)
  })


  // delete-todo from todo list window
  ipcMain.on('delete-todo', (event, todo) => {
    const updatedTodos = todosData.deleteTodo(todo).todos

    mainWindow.send('todos', updatedTodos)
  })

  // open window worker more
  ipcMain.on('window-worker-more', (event, worker_full_name) => {
    // if addTodoWin does not already exist
    if (!workerWindow) {
      // create a new add todo window
      workerWindow = new Window({
        file: path.join('renderer', 'worker.html'),
        width: 580,
        height: 700,
        // close with the main window
        parent: mainWindow
      })


      // cleanup
      workerWindow.on('closed', () => {
        workerWindow = null
      })
    }
    workerWindow.once('show', () => {

      const worker_data = workersData.getWorker(worker_full_name)
      const Links_ = linksData.getLinks_by_worker(worker_full_name)
      console.log ("links  for worker" + Links_)
      workerWindow.webContents.send('worker_data', worker_data)
      workerWindow.webContents.send('tasks', Links_)
      workerWindow.webContents.send('addtask', get_free_tasks_by_worker(worker_full_name))
    })

  })



  ipcMain.on('window-task-more', (event, task_name) => {
    // if addTodoWin does not already exist
    if (!taskWindow) {
      // create a new add todo window
      taskWindow = new Window({
        file: path.join('renderer', 'task.html'),
        width: 580,
        height: 700,
        // close with the main window
        parent: mainWindow
      })


      // cleanup
      taskWindow.on('closed', () => {
        taskWindow = null
      })
    }
    taskWindow.once('show', () => {
      const task_data = tasksData.getTask(task_name)
      const Links_ = linksData.getLinks_by_task(task_name)
      console.log ("links  for task" + Links_)
      taskWindow.webContents.send('task_data', task_data)
      taskWindow.webContents.send('workers', Links_)
      taskWindow.webContents.send('addworker', get_free_workers_by_task(task_name))
    })

  })

  ipcMain.on('window-task-delete', (event, task_name) => {
    taskWindow = null

    const updatedTasks = tasksData.deleteTask(task_name).tasks
    const updatedLinks = linksData.deleteLink_by_task(task_name).links

    mainWindow.send('tasks', updatedTasks)


  })


  ipcMain.on('window-worker-delete', (event, worker_full_name) => {


      workerWindow = null

    const updatedWorkers = workersData.deleteWorker(worker_full_name).workers
    console.log(updatedWorkers)
    const updatedLinks = linksData.deleteLink_by_worker(worker_full_name).links

    mainWindow.send('workers', updatedWorkers)


  })


ipcMain.on('window-task-update', (event, task) => {
  if (!taskupdateWindow) {
    taskupdateWindow = new Window({
      file: path.join('renderer', 'updatetask.html'),
      width: 800,
      height: 400,
      // close with the main window
      parent: mainWindow
    })


    // cleanup
    taskupdateWindow.on('closed', () => {
      taskupdateWindow = null
    })
  }

  taskupdateWindow.once('show', () => {
    taskupdateWindow.webContents.send('task_data', task)
  })

})


ipcMain.on('update-task', (event, task) => {
  console.log ("reacts")
  const updatedTasks = tasksData.deleteTask(task[0]).tasks
  const updatedTasks_ = tasksData.addTask(task[1]).tasks
  mainWindow.send('tasks', updatedTasks_)
  const task_data = tasksData.getTask(task[1][0])
  taskWindow.webContents.send('task_data', task_data)


})

ipcMain.on('window-worker-update', (event, worker) => {
  if (!workerupdateWindow) {
    workerupdateWindow = new Window({
      file: path.join('renderer', 'updateworker.html'),
      width: 800,
      height: 350,
      // close with the main window
      parent: mainWindow
    })


    // cleanup
    workerupdateWindow.on('closed', () => {
      workerupdateWindow = null
    })
  }
  console.log (worker)
  workerupdateWindow.once('show', () => {
    workerupdateWindow.webContents.send('worker_data', worker)
  })

})


ipcMain.on('update-worker', (event, worker) => {
  const updatedWorkers = workersData.deleteWorker(worker[0]).workers
  const updatedWorkers_ = workersData.addWorker(worker[1]).workers
  mainWindow.send('workers', updatedWorkers_)
  const worker_data = workersData.getWorker(worker[1][0])
  workerWindow.webContents.send('worker_data', worker_data)


})

  ipcMain.on('delete-link-worker', (event, link) => {
  //link [0] link name
  //link [1] worker name

    const updatedLinks = linksData.deleteLink(link[0]).links
    const Links_ = linksData.getLinks_by_worker(link[1])

    workerWindow.send('tasks', Links_)
    workerWindow.webContents.send('addtask', get_free_tasks_by_worker(link[1]))



  })


  ipcMain.on('delete-link-task', (event, link) => {
  //link [0] link name
  //link [1] task name

    const updatedLinks = linksData.deleteLink(link[0]).links
    const Links_ = linksData.getLinks_by_task(link[1])
    console.log('here is updated links', Links_)

    taskWindow.send('workers', Links_)
    taskWindow.webContents.send('addworker', get_free_workers_by_task(link[1]))


  })

  ipcMain.on('add-link-to-worker', (event, link) => {

    const updatedLinks = linksData.addLink(link).links

    const Links_ = linksData.getLinks_by_worker(link[2])

    workerWindow.send('tasks', Links_)
    workerWindow.webContents.send('addtask', get_free_tasks_by_worker(link[2]))


  })



  ipcMain.on('add-link-to-task', (event, link) => {

    const updatedLinks = linksData.addLink(link).links

    const Links_ = linksData.getLinks_by_task(link[1])


    taskWindow.send('workers', Links_)
    taskWindow.webContents.send('addworker', get_free_workers_by_task(link[1]))


  })


  ipcMain.on('get-free-tasks-for-worker', (event, worker_full_name) => {


    workerWindow.webContents.send('addtask', get_free_tasks_by_worker(worker_full_name))


  })



  ipcMain.on('get-free-workers-for-task', (event, task_name) => {

    taskWindow.webContents.send('addworker', get_free_workers_by_task(task_name))

  })



//const updatedWorkers = workersData.addWorker(worker).workers
//get-free-tasks-for-worker

}

function get_free_tasks_by_worker(full_name){
  //links of this worker
  const links = linksData.getLinks_by_worker(full_name)
  //all the tasks
  const tasks = tasksData.tasks

  var tasklist_1 = []
  var tasklist_2 = []
  var finish_task_list = []
  for (var i = 0; i < links.length; i++){
    tasklist_1.push (links[i][1])
  }
  for (var j = 0; j < tasks.length; j++){
    tasklist_2.push (tasks[j][0])
    finish_task_list.push (tasks[j][0])
  }

  for (var k = 0; k < tasklist_2.length; k++){
    for (var m = 0; m < tasklist_1.length; m++){
      if (tasklist_2[k] == tasklist_1 [m]){
        var finish_task_list = _.without(finish_task_list, tasklist_1[m]);
      }
    }
  }

  return finish_task_list
}

function get_free_workers_by_task(task_name){
  const Links_ = linksData.getLinks_by_task(task_name)
  console.log('here is updated links', Links_)

  //links of this task
  const links = linksData.getLinks_by_task(task_name)
  //all the workers
  const workers = workersData.workers

  var workerlist_1 = []
  var workerlist_2 = []
  var finish_worker_list = []
  for (var i = 0; i < links.length; i++){
    workerlist_1.push (links[i][2])
  }
  for (var j = 0; j < workers.length; j++){
    workerlist_2.push (workers[j][0])
    finish_worker_list.push (workers[j][0])
  }

  for (var k = 0; k < workerlist_2.length; k++){
    for (var m = 0; m < workerlist_1.length; m++){
      console.log ( workerlist_2[k] +"   "+ workerlist_1 [m])
      if (workerlist_2[k] == workerlist_1 [m]){
        console.log ("got it")
        var finish_worker_list = _.without(finish_worker_list, workerlist_1[m]);
      }
    }
  }

  return finish_worker_list

}


app.on('ready', main)

app.on('window-all-closed', function () {
  app.quit()
})
