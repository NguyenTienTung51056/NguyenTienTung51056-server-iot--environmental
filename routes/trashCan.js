const express = require('express');
const router = express.Router();
const {trashCans,createTrashCan,updateTrashCan} = require('../controller/trashCan');

router.get('/', trashCans);
router.post('/', createTrashCan);
router.put('/:id', updateTrashCan);


module.exports = router;
