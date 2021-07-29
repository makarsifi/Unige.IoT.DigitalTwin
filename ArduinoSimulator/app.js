'use strict';
const mqtt = require('mqtt') //https://github.com/mqttjs/MQTT.js/

var mqttClient = mqtt.connect('mqtt://test.mosquitto.org');
const mqttTopic = 'unige/iot/twinbridge-karsifi-cadri';

mqttClient.on('connect', function () {
    setInterval(function () {
        var arduino = GenerateRandomArduinoValues();
        mqttClient.publish(mqttTopic, arduino);
        console.log(arduino);
    }, 2000);
})


function GenerateRandomArduinoValues() {
    var pilesArray = [];
    for (var i = 0; i < 4; i++) {
        pilesArray.push({
            pressure: getRandomArbitrary(0, 600),
            wind: getRandomArbitrary(0, 150),
            temperature: getRandomArbitrary(0, 150),
            humidity: getRandomArbitrary(0, 100),
            rain: getRandomArbitrary(0, 300),
        });
    }
    return JSON.stringify(pilesArray);
}

function getRandomArbitrary(min, max) {
    var result = Math.random() * (max - min) + min;
    return result.toFixed(2);
}