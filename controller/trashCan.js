import Trashcan from "../model/trashCan.js";
import Image from "../model/image.js";
import Location from "../model/location.js";

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
    const lat = req.body.lat;
    const lng = req.body.lng;
    const address = req.body.address;
    const name = req.body.name;
    const count_trash_child = req.body.count_trash_child;
    const trash_child = req.body.trash_child;
    const district = req.body.district;
    const commune = req.body.commune;
    const province = req.body.province;
    try {
        const trashcan = new Trashcan({
            name: name,
            lat: lat,
            lng: lng,
            address: address,
            count_trash_child: count_trash_child,
            trash_child: trash_child
        });
        await trashcan.save();

        const location = new Location({
            formatted_address: address,
            location: { lat: lat, lng: lng },
            compound: {
                district: district,
                commune: commune,
                province: province
            },
            trashCanId: trashcan._id
        });
        await location.save();
        res.json({ status: "success", message: "Trashcan created successfully" })
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