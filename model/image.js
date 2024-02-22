import mongoose from 'mongoose';
const imageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image_url: { type: String, required: true },
    image_type: { type: String, enum: ['image_area', 'thumnail_image'] },
    trashCan: { type: mongoose.Schema.Types.ObjectId, ref: 'TrashCan', required: false }
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);
export default Image; 