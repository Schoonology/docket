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
  var _tasks = db.defaults({
    tasks: []
  })
    .get('tasks')
    .groupBy('name')
    .map(function (chunks, name) {
      var task = { name: name }

      task.remaining = 0
      task.elapsed = 0

      chunks.forEach(function (chunk) {
        var elapsed = Date.now() - chunk.started

        if (elapsed > chunk.duration) {
          elapsed = chunk.duration
        } else {
          task.remaining += chunk.duration - elapsed
        }

        task.elapsed += elapsed
      })

      return task
    })
    .values()
  var current = _tasks.find('remaining').value()
  var lines = ['# Docket', '']

  if (options.raw) {
    return current && { message: formatDuration(
      moment.duration(current.remaining)
    )}
  }

  if (current) {
    lines.push(util.format('Current chunk: %s remaining.', formatDuration(
      moment.duration(current.remaining)
    )))
  }

  if (_tasks.get('length').value()) {
    lines.push(util.format('Total time: %s', formatDuration(moment.duration(_tasks
      .map('elapsed')
      .sum()
      .value()
    ))))
  }

  if (current || _tasks.get('length').value()) {
    lines.push('')
  }

  lines.push('## Tasks')
  lines.push('')

  if (_tasks.get('length').value()) {
    lines = lines.concat(_tasks
      .map(function (task) {
        return util.format('- %s: %s', task.name, formatDuration(moment.duration(task.elapsed)))
      })
      .value()
    )
  } else {
    lines.push('None.')
  }

  lines.push('')

  return {
    message: lines.join('\n')
  }
}

module.exports = status
