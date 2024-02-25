import { getFirebaseStorage } from "../config/firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


const uploadImageToFirebase = async (file) => {
    const storage = getFirebaseStorage();
    const data = {}
    const filePath = 'images/' + file.originalname;
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