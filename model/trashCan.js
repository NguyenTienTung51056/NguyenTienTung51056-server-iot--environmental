import mongoose from "mongoose";
const TrashCanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true },
    image_area: { type: Buffer, required: false },
    thumnail_image: { type: Buffer, required: false },
    count_trash_child: { type: Number, required: true },
    trash_child: [
      {
        height: { type: Number, required: true },
        width: { type: Number, required: true },
        type: { type: String, enum: ["organic", "inorganic", "other",], required: true },
        level_gauges: { type: Number, required: true },
      }
    ],
    id_mac_of_device: { type: String, required: false },
  },
  { timestamps: true }
);



const TrashCan = mongoose.model("TrashCan", TrashCanSchema);
export default TrashCan;
