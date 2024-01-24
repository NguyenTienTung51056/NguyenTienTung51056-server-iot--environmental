import mongoose from "mongoose";

const DeviceSchema = new mongoose.Schema(
  {
    mac_a: { type: String, required: true, },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    level_gauges : { type: Number, required: true },
  },
  { timestamps: true }
);

const Device = mongoose.model("Device", DeviceSchema);
export default Device;
  