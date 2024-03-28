import Device from "../model/device.js";
import { client } from "../config/mqtt.js";
import TrashCan from "../model/trashCan.js";

// Định nghĩa hàm gửi message qua MQTT
const publishMessage = async () => {
    const topic = 'device_virtual_data'; // Đặt topic bạn muốn publish message
    const message = {}
    try {
        const devices = await Device.find({});
        if (devices.length > 0) {
            devices.forEach(async device => {
                const randomDistance = Math.floor(Math.random() * 1000);
                const randomTrashLevelPresent = Math.floor(Math.random() * 100);
                const status = randomTrashLevelPresent > 70 ? 'low' : randomTrashLevelPresent > 30 ? 'center' : 'high';
                message.mac_a = device.mac_a;
                message.distance = randomDistance;
                message.trash_level_present = randomTrashLevelPresent;
                message.virtual = device.virtual;
                message.status = status;
                const convert = JSON.stringify(message);
                client.publish(topic, convert);

                // Cập nhật dữ liệu trong cơ sở dữ liệu của trashcans
                await TrashCan.updateOne(
                    { "trash_child.id_mac_of_device": device.mac_a }, // Điều kiện tìm kiếm
                    { $set: { "trash_child.$.level_gauges": randomDistance } } // Dữ liệu cập nhật
                );
            });
        }
    } catch (error) {
        console.log(error);
    }
};

export { publishMessage }