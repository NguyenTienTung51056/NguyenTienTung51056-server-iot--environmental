const validateTrashCanFields = (req, res) => {
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

    if (
        lat === '' ||
        lng === '' ||
        address === '' ||
        name === '' ||
        count_trash_child === '' ||
        trash_child === '' ||
        district === '' ||
        commune === '' ||
        province === '' ||
        image_area === '' ||
        image_thumbnail === '' ||
        trash_child_images === ''
    ) {
        return res.json({
            status: "fail",
            code: 400,
            message: "Please fill all the fields"
        });
    }

    return null; // Indicates all fields are filled
}


const checkDuplicateMacIDs = async (req, check) => {
    const { _id, trash_child } = req.body;
    const mac_ids = trash_child.map(trash => trash.id_mac_of_device);
    let mac_id_of_device_exist
    if (check === 0) {
        mac_id_of_device_exist = await Trashcan.findOne({
            "trash_child.id_mac_of_device": { $in: mac_ids }
        });
    } else {
        mac_id_of_device_exist = await Trashcan.findOne({
            _id: { $ne: _id }, // Loại trừ Trashcan mà bạn đang tạo mới
            "trash_child.id_mac_of_device": { $in: mac_ids }
        });
    }
    return mac_id_of_device_exist; // Returns null if no duplicates found, otherwise returns the duplicate object
}

export { validateTrashCanFields, checkDuplicateMacIDs }