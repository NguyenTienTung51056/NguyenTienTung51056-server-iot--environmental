const express = require('express');
const router = express.Router();
const {getDevices,refreshDevice} = require('../controller/device');

router.get('/', getDevices);
router.delete('/', refreshDevice);


module.exports = router;
