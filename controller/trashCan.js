import Trashcan from "../model/trashCan.js";
import Image from "../model/image.js";

//get all trashcans
const trashCans = async (req, res) => {
    try {
        const trashCans = await Trashcan.find();
        const images = await Image.find();
        trashCans.forEach(trashCan => {
            trashCan.image = images.filter(image => image.trashCan.toString() === trashCan._id.toString());
        });

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






export { trashCans, createTrashCan, updateTrashCan, getLevelGauge };