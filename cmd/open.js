var lowdb = require('lowdb')
var string = require('underscore.string')

function open(argv, options, loader) {
  var title = options._[0] || 'Docket'
  var filename = options._[1] || string.slugify(title) + '.json'
  var db = lowdb(filename)

  db
    .set('title', options._[0] ? title : db.get('title', title).value())
    .defaults({
      tasks: []
    })
    .value()
}

module.exports = open
