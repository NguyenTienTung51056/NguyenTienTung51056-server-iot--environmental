const Devices = require("../model/device");

const getDevices = async (req, res) => {
    try {
        const devices = await Devices.find();
        res.json(devices);
    } catch (err) {
        res.json({ message: err });
    }
}

module.exports = { getDevices };
