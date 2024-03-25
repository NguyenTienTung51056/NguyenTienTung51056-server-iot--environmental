import TrashCan from "../model/trashCan.js";
import { uploadImageToFirebase } from "./uploadImage.js";

async function uploadImagesToFirebase(_id, image_area, image_thumbnail, trash_child_images) {
    const uploadPromises = [];

    if (image_area) {
        uploadPromises.push(uploadImageToFirebase(_id, image_area[0]));
    }

    if (image_thumbnail) {
        uploadPromises.push(uploadImageToFirebase(_id, image_thumbnail[0]));
    }

    if (trash_child_images && trash_child_images.length > 0) {
        uploadPromises.push(...trash_child_images.map(image => uploadImageToFirebase(_id, image, true)));
    }

    const uploadResults = await Promise.all(uploadPromises);

    let image_areaed, image_thumnailed, trash_child_imagesed;

    if (image_area) {
        image_areaed = uploadResults.shift();
    }

    if (image_thumbnail) {
        image_thumnailed = uploadResults.shift();
    }

    trash_child_imagesed = uploadResults;

    const updateImageData = {};

    if (image_areaed) {
        updateImageData.name_area = image_areaed.name;
        updateImageData.image_area = image_areaed.url;
    }

    if (image_thumnailed) {
        updateImageData.name_thumnail = image_thumnailed.name;
        updateImageData.image_thumnail = image_thumnailed.url;
    }

    return { updateImageData, trash_child_imagesed };
}

async function updateTrashChildImages(_id, trash_child, trash_child_imagesed) {
    const trashChildToEditImages = trash_child.filter(trash => !Object.keys(trash).includes('image_trash_type'));

    const updatePromises = trashChildToEditImages.map(async (trash, i) => {
        await TrashCan.updateOne({ _id, "trash_child.stt": trash.stt }, {
            $set: {
                [`trash_child.${trash.stt - 1}.name_image_of_trash_type`]: trash_child_imagesed.length > 1 ? trash_child_imagesed[i].name : trash_child_imagesed[0].name,
                [`trash_child.${trash.stt - 1}.image_trash_type`]: trash_child_imagesed.length > 1 ? trash_child_imagesed[i].url : trash_child_imagesed[0].url
            }
        });
    });

    await Promise.all(updatePromises);
}


export { uploadImagesToFirebase, updateTrashChildImages };