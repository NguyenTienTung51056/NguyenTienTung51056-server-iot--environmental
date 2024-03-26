// mqttHandler.js
import mqtt from 'mqtt';
import { handleConnectMessage, handleDistanceMessage, handleLocationMessage } from '../db/mongodbHandler.js';

let client; // MQTT client

// Setup the MQTT client
const connectMqtt = async () => {
    const mqttOptions = {
        host: '29a417c9a64f4ad4ab59157f8f329b45.s2.eu.hivemq.cloud',
        port: 8883,
        protocol: 'mqtts',
        username: 'mqttrash',
        password: 'Mqtt123123'
    }

    // Initialize the MQTT client
    client = mqtt.connect(mqttOptions);
    // Setup the callbacks
    client.on('connect', function () {
        console.log('Connected to MQTT server');

        client.on('message', function (topic, message) {
            switch (topic) {
                case 'connect':
                    // console.log('Received message on distance topic:', message.toString());
                    break;
                case 'distance_for_backend':
                    handleDistanceMessage(message.toString());
                    break;
                case 'location':
                    // handleLocationMessage(message.toString());
                    break;
                case 'trash_level_present':
                    //console.log('Received message on distance topic:', message.toString());
                    break;
                default:
                    console.log('Unknown topic:', topic);
                    break;
            }
        });

        client.subscribe('connect', function (err) {
            if (err) {
                console.log('Error subscribing to connect:', err);
            } else {
                console.log('Subscribed to connect');
            }
        });

        client.subscribe('distance_for_backend', function (err) {
            if (err) {
                console.log('Error subscribing to distance:', err);
            } else {
                console.log('Subscribed to distance');
            }
        });

        client.subscribe('location', function (err) {
            if (err) {
                console.log('Error subscribing to location:', err);
            } else {
                console.log('Subscribed to location');
            }
        });

        client.subscribe('trash_level_present', function (err) {
            if (err) {
                console.log('Error subscribing to trash_level_present:', err);
            } else {
                console.log('Subscribed to location');
            }
        });
    });
}

export { connectMqtt, client };
