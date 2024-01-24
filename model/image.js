import mongoose from 'mongoose';
const imageSchema = new mongoose.Schema({
    name: String,
    image_url: String
});

const Image = mongoose.model('Image', imageSchema);
export default Image;