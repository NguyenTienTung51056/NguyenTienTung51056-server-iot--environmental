const Trashcan = require("../model/trashCan");


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


module.exports = { trashCans, createTrashCan,updateTrashCan,getLevelGauge };