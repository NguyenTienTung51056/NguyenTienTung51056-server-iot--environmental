import mongoose from "mongoose";
const TrashCanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true },
    count_trash_child: { type: Number, required: false },
    image: { type: Array, required: false },
    trash_child: [
      {
        stt: { type: Number, required: false, unique: true },
        height: { type: Number, required: false },
        width: { type: Number, required: false },
        type: { type: String, enum: ["organic", "inorganic", "other"], required: false },
        level_gauges: { type: Number, required: false }
      }
    ],
    id_mac_of_device: { type: String, required: false },
  },
  { timestamps: true }
);



const TrashCan = mongoose.model("TrashCan", TrashCanSchema);
export default TrashCan;
