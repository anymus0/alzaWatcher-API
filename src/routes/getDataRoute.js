const express = require('express')
const router = express.Router()
const data = require('./../controllers/getDataController')

router.get('/latestImage', data.getImage)

router.get('/latestStatus', data.getProdStatus)

module.exports = router
