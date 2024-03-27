import Device from '../model/device.js';
import TrashCan from '../model/trashCan.js';


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

const handleDeviceVirtualMessage = async (message) => {
    try {
        const device = await Device.findOne({ mac_a: JSON.parse(message).mac_a });
        if (device) {
            return await Device.updateOne({ mac_a: JSON.parse(message).mac_a }, { virtual: JSON.parse(message).virtual });
        }
        const { mac_a, virtual } = JSON.parse(message);
        await Device.create({ mac_a, virtual });
    } catch (error) {
        console.log(error);
    }

};




export { handleDistanceMessage, handleDeviceVirtualMessage };
