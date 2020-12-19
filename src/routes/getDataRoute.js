const express = require('express')
const router = express.Router()
const data = require('./../controllers/getDataController')

router.get('/latestImage', data.getImage)

module.exports = router
