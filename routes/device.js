const express = require('express');
const router = express.Router();
const {getDevices} = require('../controller/device');

router.get('/', getDevices);


module.exports = router;
