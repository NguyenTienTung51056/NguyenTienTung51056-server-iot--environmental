import Trashcan from "../model/trashCan.js";
import Image from "../model/image.js";
import Location from "../model/location.js";
import { uploadImageToFirebase, listImageFromFirebase, deleteImageFromFirebase } from "../utils/uploadImage.js";

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

        if (lat === '' || lng === '' || address === '' || name === '' || count_trash_child === '' || trash_child === '' || district === '' || commune === '' || province === '' || image_area === '' || image_thumbnail === '' || trash_child_images === '') {
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
        image_area_unchanged,
        image_thumbnail_unchanged,
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

        if (_id === '' || lat === '' || lng === '' || address === '' || name === '' || count_trash_child === '' || trash_child === '' || district === '' || commune === '' || province === '' || image_area === '' || image_thumbnail === '' || trash_child_images === '') {
            return res.json({
                status: "fail",
                code: 400,
                message: "Please fill all the fields"
            });
        }


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

        const updateImageData = {
            image_area: image_area_unchanged,
            image_thumnail: image_thumbnail_unchanged
        };



        const uploadPromises = [];

        // Kiểm tra điều kiện và thêm promise vào mảng uploadPromises nếu điều kiện đúng
        if (image_area) {
            uploadPromises.push(uploadImageToFirebase(_id, image_area[0]));
        }

        if (image_thumbnail) {
            uploadPromises.push(uploadImageToFirebase(_id, image_thumbnail[0]));
        }

        // Nếu trash_child_images không rỗng, thêm các promise vào mảng uploadPromises
        if (trash_child_images && trash_child_images.length > 0) {
            uploadPromises.push(...trash_child_images.map(image => uploadImageToFirebase(_id, image, true)));
        }

        // Thực hiện tất cả các promise trong mảng uploadPromises cùng một lúc và chờ tất cả chúng hoàn thành
        const uploadResults = await Promise.all(uploadPromises);

        let image_areaed, image_thumnailed, trash_child_imagesed;

        if (image_area) {
            image_areaed = uploadResults.shift(); // Lấy phần tử đầu tiên từ mảng uploadResults
        }

        if (image_thumbnail) {
            image_thumnailed = uploadResults.shift(); // Lấy phần tử thứ hai từ mảng uploadResults
        }

        trash_child_imagesed = uploadResults;

        if (image_areaed) {
            updateImageData.name_area = image_areaed.name;
            updateImageData.image_area = image_areaed.url;

        }

        if (image_thumnailed) {
            updateImageData.name_thumnail = image_thumnailed.name;
            updateImageData.image_thumnail = image_thumnailed.url;
        }


        await Image.updateOne({
            _id: id_image
        }, {
            $set: updateImageData,
            setDefaultsOnInsert: true
        });



        const trashcansaved = await Trashcan.updateOne({ _id }, {
            name,
            lat,
            lng,
            address,
            count_trash_child,
            trash_child
        }, { setDefaultsOnInsert: true });


        const locationesaved = await Location.updateOne({ _id: id_location }, {
            $set: {
                formatted_address: address,
                location: {
                    lat,
                    lng
                },
                compound: {
                    district,
                    commune,
                    province
                }
            }
        }, { setDefaultsOnInsert: true });


        const trashChildToEditImages = trash_child.filter(trash => !Object.keys(trash).includes('image_trash_type'));

        const updatePromises = trashChildToEditImages.map(async (trash, i) => {
            await Trashcan.updateOne({
                _id,
                "trash_child.stt": trash.stt
            }, {
                $set: {
                    [`trash_child.${trash.stt - 1}.name_image_of_trash_type`]: trash_child_imagesed.length > 1 ? trash_child_imagesed[i].name : trash_child_imagesed[0].name,
                    [`trash_child.${trash.stt - 1}.image_trash_type`]: trash_child_imagesed.length > 1 ? trash_child_imagesed[i].url : trash_child_imagesed[0].url
                }
            });
        });

        await Promise.all(updatePromises);

        const imageInTrashCanOfFireBase = await listImageFromFirebase(`images/${_id}/`);
        const imagesInTrashChildOfFireBase = await listImageFromFirebase(`images/${_id}/trashChild/`);

        // Lấy hình ảnh của thùng rác từ MongoDB
        const imageInTrashCan = await Image.findOne({ trashCan: _id });

        // Lấy thông tin thùng rác từ MongoDB
        const trashcan = await Trashcan.findOne({ _id });

        // Khởi tạo mảng để lưu các hình ảnh cần xóa
        let imageInTrashChildToGetForDelete;
        let imageInTrashCanToGetForDelete;

        imageInTrashCanToGetForDelete = imageInTrashCanOfFireBase.filter(image => {
            return image !== imageInTrashCan.name_area && image !== imageInTrashCan.name_thumnail;
        });


        imageInTrashChildToGetForDelete = imagesInTrashChildOfFireBase.filter(image => {
            return !trashcan.trash_child.some(trash => trash.name_image_of_trash_type === image);
        });

        console.log(imageInTrashChildToGetForDelete);
        console.log(imageInTrashCanToGetForDelete);

        if (imageInTrashChildToGetForDelete) {
            imageInTrashChildToGetForDelete.forEach(async image => {
                await deleteImageFromFirebase(image);
            });
        }

        if (imageInTrashCanToGetForDelete) {
            imageInTrashCanToGetForDelete.forEach(async image => {
                await deleteImageFromFirebase(image);
            });

        }

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
    console.log(req.body);



    res.json({
        status: "success",
        message: "Trashcan deleted successfully"
    });
    // try {
    //     const trashCan = await Trashcan.findById(id);
    //     const image = await Image.findOne({ trashCan: id });
    //     const location = await Location.findOne({ trashCanId: id });

    //     if (!trashCan) {
    //         return res.json({
    //             status: "fail",
    //             code: 404,
    //             message: "Trashcan not found"
    //         });
    //     }

    //     await Trashcan.findByIdAndRemove(id);
    //     await Image.findByIdAndRemove(image._id);
    //     await Location.findByIdAndRemove(location._id);

    //     res.json({
    //         status: "success",
    //         message: "Trashcan deleted successfully"
    //     });

    // }
    // catch (err) {
    //     res.json({ message: err });
    // }

}




export { trashCans, createTrashCan, updateTrashCan, deleteTrashCan };