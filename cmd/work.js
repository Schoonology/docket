var path = require('path')
var lowdb = require('lowdb')
var notifier = require('node-notifier')

function work(argv, options, loader) {
  var name = options._[0] || 'Unassigned'
  var db = lowdb(options.db || path.join(process.env.HOME, '.docket'))

  // TODO(schoon) - Push a chunk into the database so that `status` can format
  // a full report.
  db.set('task', {
    started: Date.now(),
    duration: options.duration || 5000,
    name: name
  })
    .value()

  setTimeout(function () {
    notifier.notify({
      title: 'Docket',
      message: 'Chunk complete: ' + name,
      icon: null
    })

    db.unset('task').value()
  }, options.duration || 5000)
}

module.exports = work
