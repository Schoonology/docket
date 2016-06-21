var path = require('path')
var lowdb = require('lowdb')

function clear(argv, options, loader) {
  var db = lowdb(options.db || path.join(process.env.HOME, '.docket'))

  db.set('tasks', []).value()
}

module.exports = clear
