const express = require('express');
const router = express.Router();
const { trashCans, createTrashCan, updateTrashCan, addImage, getImage } = require('../controller/trashCan');
const multer = require('multer');
const path = require('path');
// const storage = multer.diskStorage({
//     destination: 'tmp/images/',
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     },
// });

// const upload = multer({ storage: storage });

router.get('/', trashCans);
router.get('/image/:id', getImage);
router.post('/', createTrashCan);
// router.post('/images', upload.single('image'), addImage);
router.put('/:id', updateTrashCan);


module.exports = router;
