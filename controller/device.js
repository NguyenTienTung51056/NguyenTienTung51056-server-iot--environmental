import Device from "../model/device.js";

const deleteDevice = async (req, res) => {
    const { id } = req.params;
    try {
        await Device.deleteOne({ mac_a: id})
        res.status(200).json({ message: "Delete device successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { deleteDevice }