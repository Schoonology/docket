var path = require('path')
var lowdb = require('lowdb')
var parseDuration = require('parse-duration')
var DEFAULT_DURATION = '25 minutes'

function add(argv, options, loader) {
  var name = options._[0] || 'Unassigned'
  var db = lowdb(options.db || path.join(process.env.HOME, '.docket'))
  var duration = parseDuration(options.duration || DEFAULT_DURATION)

  db.defaults({
      tasks: []
    })
    .get('tasks')
    .push({
      started: 0,
      duration: duration,
      name: name
    })
    .value()
}

module.exports = add
