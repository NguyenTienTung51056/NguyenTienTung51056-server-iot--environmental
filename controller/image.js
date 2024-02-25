import Image from "../model/image.js"
import { uploadImageToFirebase } from '../utils/uploadImage.js'

const uploadImage = async (req, res) => {
    const file = req.file;
    const nameTypeOfImage = req.body.nameTypeOfImage;
    const trashCanId = req.body.trashCanId;
    try {
        const data = await uploadImageToFirebase(file)
        data.image_type = nameTypeOfImage;
        if (nameTypeOfImage === "image_area") {
            data.image_area = data.url;
        } else {
            data.image_thumnail = data.url;
        }
        data.trashCan = trashCanId;
        const savedImage = await Image.create(data);
        if (savedImage) {
            res.json({ sta: 200, message: "upload image success" });
        } else {
            res.json({ sta: 404, message: "upload image failed" });
        }
    } catch (error) {
        res.json({ sta: 404, message: error.message });
    }
};

export { uploadImage };
