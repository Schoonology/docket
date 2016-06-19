var path = require('path')
var lowdb = require('lowdb')
var notifier = require('node-notifier')
var TIMER_ID

function work(argv, options, loader) {
  var name = options._[0] || 'Unassigned'
  var db = lowdb(options.db || path.join(process.env.HOME, '.docket'))

  db.defaults({
      tasks: []
    })
    .get('tasks')
    .each(function (task) {
      var elapsed = Date.now() - task.started

      if (task.duration > elapsed) {
        task.duration = elapsed
      }

      if (task.timerId) {
        clearTimeout(task.timerId)
        task.timerId = null
      }
    })
    .push({
      started: Date.now(),
      duration: options.duration || 5000,
      name: name
    })
    .value()

  clearTimeout(TIMER_ID)

  TIMER_ID = setTimeout(function () {
    notifier.notify({
      title: 'Docket',
      message: 'Chunk complete: ' + name,
      icon: null
    })
  }, options.duration || 5000)
}

module.exports = work
