import { getFirebaseStorage } from "../config/firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


const uploadImageToFirebase = async (idTrashcan, file, trashChild) => {
    const storage = getFirebaseStorage();
    const data = {}
    const filePath = trashChild ? `images/${idTrashcan}/trashChild/${file.originalname}` : `images/${idTrashcan}/${file.originalname}`;
    const storageRef = ref(storage, filePath);
    try {
        await uploadBytes(storageRef, file.buffer)
            .then(async (snapshot) => {
                const url = await getDownloadURL(snapshot.ref);
                data.url = url;
                data.name = filePath;
            })
            .catch((err) => {
                return err.message;
            });
        return data;
    } catch (error) {
        return error.message;
    }
}


const listImageFromFirebase = async (namePath) => {
    const storage = getFirebaseStorage();
    const storageRef = ref(storage, namePath);
    const listRef = ref(storageRef);
    const list = [];
    listRef.listAll()
        .then((res) => {
            res.items.forEach((itemRef) => {
                list.push(itemRef.fullPath);
            });
            return list;
        })
        .catch((err) => {
            return err.message;
        });
}



const deleteImageFromFirebase = async (namePath) => {
    const storage = getFirebaseStorage();
    const storageRef = ref(storage, namePath);
    storageRef.delete()
        .then(() => {
            return true;
        })
        .catch((err) => {
            return err.message;
        });
}

export { uploadImageToFirebase };