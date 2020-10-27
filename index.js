/*! cyberhobo. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var chalk = require('chalk')
var connectivity = require('connectivity')
var cp = require('child_process')
var fs = require('fs')
var once = require('once')
var path = require('path')
var series = require('run-series')
var waterfall = require('run-waterfall')

var COMMANDS = {
  git: ['push'],
  npm: ['publish']
}
var DATA_DIR = process.env.HOME + '/.cyberhobo'

function run (argv, cwd, cb) {
  if (typeof cwd === 'function') {
    cb = cwd
    cwd = undefined
  }
  cb = cb || function () {}
  cb = once(cb)

  var child = cp.spawn(argv[0], argv.slice(1), {
    cwd: cwd,
    stdio: 'inherit'
  })
  child.on('exit', function (code) {
    if (code === 0) {
      cb(null)
    } else {
      cb(new Error('Command `' + argv.join(' ') + '` exited with code ' + code))
    }
  })
  child.on('error', cb)
}

function cyberhobo (argv) {
  waterfall([
    // Ensure that the data folder exists
    function (cb) {
      fs.mkdir(DATA_DIR, { recursive: true }, function (err) {
        if (err) {
          console.error('WARNING: Could not create ~/.cyberhobo folder')
          run(argv) // let the command run
        }
        cb(err)
      })
    },

    // Check connectivity
    function (cb) {
      connectivity(function (online) {
        cb(null, online)
      })
    },

    // Check writeahead log for commands to run
    function (online, cb) {
      if (!online) {
        return cb(null, online)
      }

      var entries
      try {
        entries = fs.readdirSync(DATA_DIR)
      } catch (err) {
        cb(new Error('Could not read from ~/.cyberhobo'))
      }

      entries.sort()

      var fns = []

      if (entries.length) {
        console.log('============================================================')
        console.log('               HEY, YOU HAVE INTERNET NOW!')
        console.log('Time to re-run the commands you saved while you were offline')
        console.log('============================================================')
      }

      entries.forEach(function (entry) {
        var filename = path.join(DATA_DIR, entry)
        try {
          var data = JSON.parse(fs.readFileSync(filename, 'utf8'))
        } catch (err) {
          console.error('ERROR: Invalid data in ' + filename)
        }

        fns.push(function (cb) {
          console.log('')
          console.log('==== ' + chalk.bold.green('Running ') + chalk.red(data.command.join(' ')) + chalk.green(' in ' + data.cwd) + ' ====')
          console.log('')
          run(data.command, data.cwd, cb)
          try {
            fs.unlinkSync(filename)
          } catch (err) {
            console.error('ERROR: Could not remove cyberhobo file: ' + filename)
          }
        })
      })

      series(fns, function (err) {
        if (entries.length) {
          console.log('CYBER HOBO MISSION COMPLETE: all up to date')
        }
        cb(err, online)
      })
    },

    // Run the command, or save it for later
    function (online, cb) {
      var program = argv[0]
      var command = argv[1]

      if (!online && COMMANDS[program] && COMMANDS[program].indexOf(command) >= 0) {
        // we're offline and this is a command we want to save for when we're online
        console.log('CYBER HOBO ACTIVATED!')

        var data = {
          command: argv,
          cwd: process.cwd()
        }

        try {
          var filename = path.join(DATA_DIR, Date.now() + '.txt')
          fs.writeFileSync(filename, JSON.stringify(data), 'utf8')
          console.log('Command saved for later!')
        } catch (err) {
          console.error('WARNING: Could not write to ~/.cyberhobo/ -- running command now')
          run(argv)
        }
      } else {
        // we're online or this is a command we don't know about -- run the command now
        run(argv)
      }
    }

  ], function (err) {
    if (err) {
      console.error(err.message || err)
    }
  })
}

module.exports = cyberhobo
