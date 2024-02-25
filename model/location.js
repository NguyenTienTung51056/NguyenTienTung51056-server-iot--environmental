import mongoose from "mongoose";
const LocationSchema = new mongoose.Schema(
    {
        formatted_address: { type: String, required: false },
        location: {
            lat: { type: Number, required: false },
            lng: { type: Number, required: false }
        },
        compound: {
            district: { type: String, required: false },
            commune: { type: String, required: false },
            province: { type: String, required: false },
        },
        trashCanId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrashCan', required: false },
    },
    { timestamps: true }
);



const Location = mongoose.model("Location", LocationSchema);
export default Location;
