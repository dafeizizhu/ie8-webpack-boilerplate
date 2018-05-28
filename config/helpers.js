const path = require('path')

// Helper functions
const ROOT = path.resolve(__dirname, '..')

function root (args) {
  args = Array.prototype.slice.call(arguments, 0)
  return path.join.apply(path, [ROOT].concat(args))
}

function pages () {
  return ['index', 'huya']
}

exports.root = root
exports.pages = pages
