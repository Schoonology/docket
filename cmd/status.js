var path = require('path')
var util = require('util')
var lowdb = require('lowdb')
var moment = require('moment')

function formatDuration(duration) {
  var time = moment(0).startOf('day').add(duration)

  if (duration.hours()) {
    return time.format('h:mm:ss')
  }

  return time.format('m:ss')
}

function status(argv, options, loader) {
  var db = lowdb(options.db || path.join(process.env.HOME, '.docket'))

  var task = db.get('task').value()

  if (!task) {
    return
  }

  var duration = moment.duration(task.duration - (Date.now() - task.started))

  if (options.raw) {
    return { message: formatDuration(duration) }
  }

  return {
    message: util.format('%j\nCurrent chunk: %s remaining.',
      db.value(),
      formatDuration(duration)
    )
  }
}

module.exports = status
