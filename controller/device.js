import Device from "../model/device.js";


const addDevice = async (req, res) => {
    const { mac_a, virtual } = req.body;
    const user_role = req.user_role;
    try {
        if (user_role === "user" || user_role === undefined) {
            return res.status(403).json({ message: "you don't have permission to create device" });
        }
        const device = new Device({ mac_a, virtual });
        await device.save();
        res.status(200).json({ message: "Add device successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};




const deleteDevice = async (req, res) => {
    const { id } = req.params;
    const user_role = req.user_role;
    try {
        if (user_role === "user" || user_role === "admin" || user_role === undefined) {
            return res.status(403).json({ message: "you don't have permission to delete device" });
        }
        await Device.deleteOne({ mac_a: id })
        res.status(200).json({ message: "Delete device successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { deleteDevice, addDevice }