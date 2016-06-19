var path = require('path')
var lowdb = require('lowdb')
var notifier = require('node-notifier')

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
    })
    .push({
      started: Date.now(),
      duration: options.duration || 5000,
      name: name
    })
    .value()

  // TODO(schoon) - Cleaner collaboration between `work` and `break`.
  clearTimeout(work.TIMER_ID)

  work.TIMER_ID = setTimeout(function () {
    notifier.notify({
      title: 'Docket',
      message: 'Chunk complete: ' + name,
      icon: null
    })
  }, options.duration || 5000)
}

module.exports = work
