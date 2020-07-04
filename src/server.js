'use strict'

const debug = require('debug-logfmt')('count')
const { default: micri } = require('micri')

const fn = require('.')

const port = process.env.PORT || process.env.port || 3000

const server = micri(fn)

server.on('error', err => {
  debug({ status: 'error', message: err.message, trace: err.stack })
  process.exit(1)
})

server.listen(port, async () => {
  const { address, port } = server.address()
  debug({
    status: 'listening',
    pid: process.pid,
    address: `${address}:${port}`
  })
})
