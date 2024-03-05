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
        const trashcans = await TrashCan.find();
        let trashcan = trashcans.find(trashcan => trashcan.trash_child.find(trash => trash.id_mac_of_device === mac_a));
        if (trashcan) {
            trashcan.trash_child.map(async trash => {
                if (trash.id_mac_of_device === mac_a) {
                    trash.level_gauges = distance;
                    await trashcan.save();
                }
            });
        }
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
