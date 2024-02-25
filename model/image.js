import mongoose from 'mongoose';
const imageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image_thumnail: { type: String, required: false },
    image_area: { type: String, required: false },
    image_type: { type: String, enum: ['image_area', 'image_thumnail'] },
    trashCan: { type: mongoose.Schema.Types.ObjectId, ref: 'TrashCan', required: false }
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);
export default Image; 