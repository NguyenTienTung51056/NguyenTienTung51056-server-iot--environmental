const mongoose = require("mongoose");

const TrashCanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true},
    height:{ type: Number, required: true },
    width: { type: Number, required: true },
    type:{type:String, required: true},
    id_mac_of_device:{ type: String, required: true },
    level_gauges : { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trashcans", TrashCanSchema);
  