import Devices from '../model/device.js';

const getDevices = async (req, res) => {
    try {
        const devices = await Devices.find();
        res.json(devices);
    } catch (err) {
        res.json({ message: err });
    }
}


//refreshDevice

const refreshDevice = async (req, res) => {
    try {
        const devices = await Devices.deleteMany();
        res.json(devices);
    } catch (err) {
        res.json({ message: err });
    }
}

export { getDevices, refreshDevice };
