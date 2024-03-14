import mongoose from 'mongoose';
const imageSchema = new mongoose.Schema({
    name_thumnail: { type: String, required: true },
    name_area: { type: String, required: true },
    image_thumnail: { type: String, required: false },
    image_area: { type: String, required: false },
    trashCan: { type: mongoose.Schema.Types.ObjectId, ref: 'TrashCan', required: false }
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);
export default Image; 