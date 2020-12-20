'use strict'
// dependencies
const express = require('express')
const app = express()
const compression = require('compression')
const xss = require('xss-clean')
const path = require('path')
const fetch = require('node-fetch')
const socket = require('socket.io')
const restPort = process.env.REST_PORT || 3000
const socketPort = process.env.SOCKET_PORT || 3001

// middlewares

// use cors in dev mode only
if (process.env.NODE_ENV !== 'production') {
  const cors = require('cors')
  app.use(cors())
}

app.use(xss())
app.use(compression())
app.use(express.json())
// serve images as static files
app.use(express.static(path.join(__dirname, '..', 'img')))

// import and use routes
const getData = require('./routes/getDataRoute')
app.use('/getData', getData)

// server init
const init = async () => {
  try {
    console.log(`REST server is listening on port ${restPort}`)
    console.log(`Socket server is listening on port ${socketPort}`)
    app.listen(restPort)
  } catch (error) {
    console.log('error inside the server')
    console.error(error)
    process.exit(1)
  }
}

// create server
const io = socket(socketPort, {
  cors: {
    origin: 'http://172.28.3.18:4200'
  }
})

// IO logic
io.on('connection', (socket) => {
  setInterval(async () => {
    const res = await fetch(`http://localhost:${restPort}/getData/latestStatus`)
    const prods = await res.json()
    io.emit('productRefresh', prods)
  }, Math.floor(Math.random() * (30000 - 20000 + 1) + 20000))
})

init()
