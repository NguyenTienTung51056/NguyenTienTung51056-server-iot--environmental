import { deleteImageFromFirebase, listImageFromFirebase } from "./uploadImage.js";

// Hàm xóa hình ảnh từ Firebase
async function deleteImagesFromFirebase(trashCanId) {
    const imagePaths = [`images/${trashCanId}/`, `images/${trashCanId}/trashChild/`];

    for (const path of imagePaths) {
        const images = await listImageFromFirebase(path);
        if (images && images.length > 0) {
            for (const image of images) {
                await deleteImageFromFirebase(image);
            }
        }
    }
}


async function deleteUnusedImagesFromFirebase(_id, imageInTrashCan, trashcan) {

    const imageInTrashCanOfFireBase = await listImageFromFirebase(`images/${_id}/`);
    const imagesInTrashChildOfFireBase = await listImageFromFirebase(`images/${_id}/trashChild/`);
    // Khởi tạo mảng để lưu các hình ảnh cần xóa
    let imageInTrashChildToGetForDelete;
    let imageInTrashCanToGetForDelete;

    imageInTrashCanToGetForDelete = imageInTrashCanOfFireBase.filter(image => {
        return image !== imageInTrashCan.name_area && image !== imageInTrashCan.name_thumnail;
    });


    imageInTrashChildToGetForDelete = imagesInTrashChildOfFireBase.filter(image => {
        return !trashcan.trash_child.some(trash => trash.name_image_of_trash_type === image);
    });

    const deletePromises = [];

    if (imageInTrashChildToGetForDelete) {
        deletePromises.push(...imageInTrashChildToGetForDelete.map(image => deleteImageFromFirebase(image)));
    }

    if (imageInTrashCanToGetForDelete) {
        deletePromises.push(...imageInTrashCanToGetForDelete.map(image => deleteImageFromFirebase(image)));
    }

    // Chờ tất cả các hàm xóa hình ảnh hoàn thành
    await Promise.all(deletePromises);
}



export { deleteImagesFromFirebase, deleteUnusedImagesFromFirebase };

