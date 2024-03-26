import TrashCan from '../model/trashCan.js';

const handleConnectMessage = async (messagee) => {
    // try {
    //     const { mac_a, lat = 0, lng = 0, level_gauges = 0 } = JSON.parse(messagee);
    //     const Devices = await Device.find();
    //     let device = Devices.find(device => device.mac_a === mac_a);
    //     if (device) {
    //     } else {
    //         device = await Device.create({ mac_a, lat, lng, level_gauges });
    //     }
    // } catch (error) {
    //     console.log(error);
    // }
};

const handleDistanceMessage = async (messagee) => {
    try {
        const { mac_a, distance } = JSON.parse(messagee);
        await TrashCan.updateOne(
            { "trash_child.id_mac_of_device": mac_a }, // Điều kiện tìm kiếm
            { $set: { "trash_child.$.level_gauges": distance } } // Dữ liệu cập nhật
        );
    } catch (error) {
        console.log(error);
    }
};


const handleLocationMessage = async (messagee) => {
    // try {
    //     const { mac_a, lat, lng } = JSON.parse(messagee);
    //     const Devices = await Device.find();
    //     let device = Devices.find(device => device.mac_a === mac_a);
    //     if (device) {
    //         device = await Device.updateOne({ mac_a }, { lat, lng });
    //     } else {
    //         const data = new Device({
    //             mac_a: mac_a,
    //             level_gauges: 0,
    //             lat: 0,
    //             lng: 0
    //         });
    //         await data.save();
    //     }
    // } catch (error) {
    //     console.log(error);
    // }
};


export { handleConnectMessage, handleDistanceMessage, handleLocationMessage };
