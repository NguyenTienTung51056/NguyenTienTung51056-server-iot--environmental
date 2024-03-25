import Trashcan from "../model/trashCan.js";
import Image from "../model/image.js";
import Location from "../model/location.js";
import { uploadImageToFirebase } from "../utils/uploadImage.js";
import { deleteImagesFromFirebase, deleteUnusedImagesFromFirebase } from "../utils/deleteImageFromFirebase.js";
import TrashCan from "../model/trashCan.js";
import { updateTrashChildImages, uploadImagesToFirebase } from "../utils/updateTrashCan.js";
import { validateTrashCanFields } from "../utils/commonFunctions.js";

//get all trashcans
const trashCans = async (req, res) => {
    try {
        const trashCans = await Trashcan.find();
        const images = await Image.find();
        const locations = await Location.find();
        trashCans.forEach(trashCan => {
            trashCan.image = images.find(image => image.trashCan.toString() === trashCan._id.toString());
            trashCan.location = locations.find(location => location.trashCanId.toString() === trashCan._id.toString());
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
        const validationError = validateTrashCanFields(req, res);

        if (validationError) return validationError;

        const mac_ids = trash_child.map(trash => trash.id_mac_of_device);
        const mac_id_of_device_exist = await Trashcan.findOne({
            "trash_child.id_mac_of_device": { $in: mac_ids }
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
                    [`trash_child.${i}.name_image_of_trash_type`]: image.name,
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
    const {
        _id,
        lat,
        lng,
        address,
        name,
        count_trash_child,
        trash_child,
        district,
        id_image,
        id_location,
        commune,
        province
    } = req.body;
    const {
        image_area,
        image_thumbnail,
        trash_child_images
    } = req.files;
    try {

        const validationError = validateTrashCanFields(req, res);
        if (validationError) return validationError;

        const mac_ids = trash_child.map(trash => trash.id_mac_of_device);
        const mac_id_of_device_exist = await Trashcan.findOne({
            _id: { $ne: _id }, // Loại trừ Trashcan mà bạn đang tạo mới
            "trash_child.id_mac_of_device": { $in: mac_ids }
        });

        if (mac_id_of_device_exist) {
            return res.json({
                status: "fail",
                code: 400,
                message: "Mac id of device already exists"
            });
        }

        const { updateImageData, trash_child_imagesed } = await uploadImagesToFirebase(_id, image_area, image_thumbnail, trash_child_images);

        await Image.updateOne({ _id: id_image }, { $set: updateImageData, setDefaultsOnInsert: true });

        await Trashcan.updateOne({ _id }, { name, lat, lng, address, count_trash_child, trash_child }, { setDefaultsOnInsert: true });

        await Location.updateOne({ _id: id_location }, {
            $set: {
                formatted_address: address,
                location: { lat, lng },
                compound: { district, commune, province }
            }
        }, { setDefaultsOnInsert: true });

        await updateTrashChildImages(_id, trash_child, trash_child_imagesed);

        const imageInTrashCan = await Image.findOne({ trashCan: _id });
        const trashcan = await TrashCan.findOne({ _id });
        await deleteUnusedImagesFromFirebase(_id, imageInTrashCan, trashcan);

        res.json({
            status: "success",
            message: "Trashcan updated successfully"
        });
    } catch (err) {
        res.json({ message: err });
    }
}



//delete a trashcan
const deleteTrashCan = async (req, res) => {
    const id = req.params.id;

    try {
        // Xóa Trashcan từ MongoDB
        const trashCan = await Trashcan.deleteOne({ _id: id });

        if (!trashCan.deletedCount) {
            return res.status(404).json({
                status: "fail",
                message: "Trashcan not found"
            });
        }

        // Xóa các mục liên quan từ MongoDB
        await Image.deleteOne({ trashCan: id });
        await Location.deleteOne({ trashCanId: id });

        // Xóa hình ảnh từ Firebase
        await deleteImagesFromFirebase(id);

        res.json({
            status: "success",
            message: "Trashcan deleted successfully"
        });

    } catch (err) {
        console.log("Error deleting trashcan:", err);
        res.status(500).json({
            status: "error",
            message: "An error occurred while deleting the trashcan"
        });
    }
}



export { trashCans, createTrashCan, updateTrashCan, deleteTrashCan };