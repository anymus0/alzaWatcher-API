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
//

// create a new Browser instance
const browser = new Browser();

(async () => {
  try {
    browser.snapImg(browser.productsURL)
    console.log(`Server is listening on port ${port}`)
    app.listen(port)
  } catch (error) {
    console.log('error inside the server')
    console.error(error)
    process.exit(1)
  }
})()
