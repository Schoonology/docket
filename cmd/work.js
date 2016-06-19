var path = require('path')
var lowdb = require('lowdb')
var notifier = require('node-notifier')
var parseDuration = require('parse-duration')
var DEFAULT_DURATION = '25 minutes'

function work(argv, options, loader) {
  var name = options._[0] || 'Unassigned'
  var db = lowdb(options.db || path.join(process.env.HOME, '.docket'))
  var duration = parseDuration(options.duration || DEFAULT_DURATION)

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
      duration: duration,
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
  }, duration)
}

module.exports = work
