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
        return res.status(400).json({
            status: "fail",
            message: "Please fill all the fields"
        });
    }

    return null; // Indicates all fields are filled
}


export {
    validateTrashCanFields
}