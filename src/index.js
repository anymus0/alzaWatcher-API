'use strict'
const express = require('express')
const app = express()
const compression = require('compression')
const xss = require('xss-clean')
const fetch = require('node-fetch')
const port = process.env.PORT || 3000
app.use(xss())
app.use(compression())
app.use(express.json())

// use cors in dev mode only
if (process.env.NODE_ENV !== 'production') {
  const cors = require('cors')
  app.use(cors())
}

// import and use routes
const getData = require('./routes/getDataRoute')
app.use('/getData', getData);

(async () => {
  try {
    console.log(`Server is listening on port ${port}`)
    app.listen(port)
    setInterval(async () => {
      const res = await fetch(`http://localhost:${port}/getData/latestStatus`)
      const prods = await res.json()
      console.log(prods)
    }, Math.floor(Math.random() * (30000 - 20000 + 1) + 20000))
  } catch (error) {
    console.log('error inside the server')
    console.error(error)
    process.exit(1)
  }
})()
