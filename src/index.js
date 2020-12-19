'use strict'
const express = require('express')
const app = express()
const compression = require('compression')
const xss = require('xss-clean')
const Browser = require('./scripts/browser')
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

// create a new Browser instance
// const browser = new Browser();

(async () => {
  try {
    console.log(`Server is listening on port ${port}`)
    app.listen(port)
    // const prods = await browser.scrapeJob()
    // console.log(prods)
  } catch (error) {
    console.log('error inside the server')
    console.error(error)
    process.exit(1)
  }
})()
