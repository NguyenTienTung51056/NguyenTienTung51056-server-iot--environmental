const Trashcan = require("../model/trashCan");
const Image = require("../model/image");
const path = require('path');


//get all trashcans
const trashCans = async (req, res) => {
    try {
        const trashCans = await Trashcan.find();
        res.json(trashCans);
    } catch (err) {
        res.json({ message: err });
    }
};

//create a trashcan
const createTrashCan = async (req, res) => {
    try {
        const savedTrashCan = await Trashcan.create(req.body);
        res.json(savedTrashCan);
    } catch (err) {
        res.json({ message: err });
    }
};
//update a trashcan

const updateTrashCan = async (req, res) => {
    try {
        const updatedTrashCan = await Trashcan.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );
        res.json(updatedTrashCan);
    } catch (err) {
        res.json({ message: err });
    }
}


//getLevelGauge
const getLevelGauge = async (req, res) => {
    try {
        const trashCans = await Trashcan.find();
        let levelGauge = [];
        trashCans.forEach(trashCan => {
            levelGauge.push(trashCan.levelGauges);
        });
        res.json(levelGauge);
    } catch (err) {
        res.json({ message: err });
    }
}

const addImage = async (req, res) => {
    try {
        // Lưu đường dẫn vào MongoDB
        const imagePath = '/upload/images/' + req.file.filename;
        const newImage = new Image({ image_url: imagePath });
        await newImage.save();

        res.json({ imagePath });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getImage = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);

        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }
        const imagePath = path.join(__dirname, '..', image.image_url);
        res.sendFile(imagePath);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



module.exports = { trashCans, createTrashCan, updateTrashCan, getLevelGauge, addImage, getImage };