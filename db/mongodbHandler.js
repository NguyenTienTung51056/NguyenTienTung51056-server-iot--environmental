const Device = require("../model/device");

const handleConnectMessage = async (messagee) => {
    try {
        const { mac_a, lat=0, lng=0, level_gauges=0 } = JSON.parse(messagee);
        const Devices = await Device.find();
        let device = Devices.find(device => device.mac_a === mac_a);
        if (device) {
        } else {
            device = await Device.create({ mac_a, lat, lng, level_gauges });
        }
    } catch (error) {
        console.log(error);
    }
};

const handleDistanceMessage = async (messagee) => {
    try {
        const { mac_a,distance } = JSON.parse(messagee);
        const Devices = await Device.find();
        let device = Devices.find(device => device.mac_a === mac_a);
        if (device) {
            device = await Device.updateOne({
                mac_a
            }, {
                level_gauges:distance
            });
        } else {
            const data = new Device({
                mac_a: mac_a,
                level_gauges: 0,
                lat: 0,
                lng: 0
            });
            await data.save();
        }
    } catch (error) {
        console.log(error);
    }
};


const handleLocationMessage = async (messagee) => {
    try {
        const { mac_a, lat, lng } = JSON.parse(messagee);
        const Devices = await Device.find();
        let device = Devices.find(device => device.mac_a === mac_a);
        if (device) {
            device = await Device.updateOne({ mac_a }, { lat, lng });
        } else {
            const data = new Device({
                mac_a: mac_a,
                level_gauges: 0,
                lat: 0,
                lng: 0
            });
            await data.save();
        }
    } catch (error) {
        console.log(error);
    }
};


module.exports = { handleConnectMessage, handleDistanceMessage, handleLocationMessage };
