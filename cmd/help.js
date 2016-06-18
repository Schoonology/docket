function help(argv, options, loader) {
  var text

  if (options._[0] && (text = loader.loadManual(options._[0]))) {
    return { name: 'UsageError', message: text }
  }

  return { name: 'UsageError', message: loader.loadManual('docket') }
}

module.exports = help
