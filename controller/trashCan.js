import Trashcan from "../model/trashCan.js";
import Image from "../model/image.js";
import Location from "../model/location.js";
import { uploadImageToFirebase } from "../utils/uploadImage.js";

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
    const {
        lat,
        lng,
        address,
        name,
        count_trash_child,
        trash_child,
        district,
        commune,
        province
    } = req.body;
    const {
        image_area,
        image_thumbnail,
        trash_child_images
    } = req.files;

    try {

        if (lat === undefined || lng === undefined || address === undefined || name === undefined || count_trash_child === undefined || trash_child === undefined || district === undefined || commune === undefined || province === undefined || image_area === undefined || image_thumbnail === undefined || trash_child_images === undefined) {
            return res.json({
                status: "fail",
                code: 400,
                message: "Please fill all the fields"
            });
        }

        const mac_id_of_device_exist = await Trashcan.findOne({
            "trash_child.id_mac_of_device": { $in: trash_child.map(trash => trash.id_mac_of_device) }
        });

        if (mac_id_of_device_exist) {
            return res.json({
                status: "fail",
                code: 400,
                message: "Mac id of device already exists"
            });
        }

        const trashcan = new Trashcan({
            name,
            lat,
            lng,
            address,
            count_trash_child,
            trash_child
        });


        const trashcansaved = await trashcan.save();

        const location = new Location({
            formatted_address: address,
            location: {
                lat,
                lng
            },
            compound: {
                district,
                commune,
                province
            },
            trashCanId: trashcan._id
        });
        await location.save();

        const uploadPromises = [
            uploadImageToFirebase(trashcansaved._id, image_area[0]),
            uploadImageToFirebase(trashcansaved._id, image_thumbnail[0]),
            ...trash_child_images.map(image => uploadImageToFirebase(trashcansaved._id, image, true))
        ];

        const [image_areaed, image_thumnail, ...trash_child_imagesed] = await Promise.all(uploadPromises);

        await Image.create({
            name_thumnail: image_thumnail.name,
            name_area: image_areaed.name,
            image_area: image_areaed.url,
            image_thumnail: image_thumnail.url,
            trashCan: trashcansaved._id
        });

        const updatePromises = trash_child_imagesed.map(async (image, i) => {
            await Trashcan.updateOne({
                _id: trashcansaved._id,
                "trash_child.stt": i + 1
            }, {
                $set: {
                    [`trash_child.${i}.image_trash_type`]: image.url
                }
            });
        });

        await Promise.all(updatePromises);

        res.json({
            status: "success",
            message: "Trashcan created successfully"
        });
    } catch (err) {
        res.json({
            message: err
        });
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