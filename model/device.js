import mongoose from 'mongoose';
const deviceSchema = new mongoose.Schema({
    mac_a: { type: String, required: true },
    virtual: { type: Boolean, required: true, default: true }
}, { timestamps: true });

const Device = mongoose.model('Device', deviceSchema);
export default Device; 