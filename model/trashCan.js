import mongoose from "mongoose";
const TrashCanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true },
    count_trash_child: { type: Number, required: false },
    image: { type: mongoose.Schema.Types.ObjectId, ref: "Image", required: false },
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: false },
    trash_child: [
      {
        stt: { type: Number, required: false, default: 1 },
        height: { type: Number, required: false },
        width: { type: Number, required: false },
        type: { type: String, enum: ["organic", "inorganic", "other"], required: false },
        name_image_of_trash_type: { type: String, required: false },
        image_trash_type: { type: String, required: false },
        level_gauges: { type: Number, required: false },
        id_mac_of_device: { type: String, required: false },
      }
    ],
  },
  { timestamps: true }
);



const TrashCan = mongoose.model("TrashCan", TrashCanSchema);
export default TrashCan;
