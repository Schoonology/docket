var path = require('path')
var lowdb = require('lowdb')
var notifier = require('node-notifier')
var parseDuration = require('parse-duration')
var work = require('./work')
var DEFAULT_DURATION = '5 minutes'

function _break(argv, options, loader) {
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
    .value()

  clearTimeout(work.TIMER_ID)

  work.TIMER_ID = setTimeout(function () {
    notifier.notify({
      title: 'Docket',
      message: 'Break complete.',
      icon: null
    })
  }, duration)
}

module.exports = _break
