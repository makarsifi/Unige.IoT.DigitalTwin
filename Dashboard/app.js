'use strict';
const debug = require('debug')('my express app');
const fs = require('fs');
const express = require('express');
const path = require('path');
const logger = require('morgan'); // adds some log events to the cmd 
const bodyParser = require('body-parser');
const ejs = require('ejs')
const mqtt = require('mqtt')
const { Server } = require('socket.io');

// express framework setup
var app = express();

// MQTT client setup
var mqttClient = mqtt.connect('mqtt://test.mosquitto.org');
const mqttTopic = "unige/iot/twinbridge-karsifi-cadri"

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// some other things needed for express
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// starting the server
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

// starting the socket.io server
const io = new Server(server);

// server methods
app.get('/', function (req, res) {
    let alertsettings = ReadAlertSettingsFile();
    res.render('index.html', { AlertSettings: JSON.stringify(alertsettings) });
});

app.get('/home', function (req, res) {
    let alertsettings = ReadAlertSettingsFile();
    res.render('index.html', { AlertSettings: JSON.stringify(alertsettings) });
});

app.get('/alertsettings', function (req, res) {
    let alertsettings = ReadAlertSettingsFile();
    res.render('alertsettings.html', alertsettings); //returned as ejs value to the view
});

app.post('/savealertsettings', function (req, res) {
    let alertsettings = {
        pressure: {
            warning: req.body["pressure.warning"],
            danger: req.body["pressure.danger"]
        },
        wind: {
            warning: req.body["wind.warning"],
            danger: req.body["wind.danger"]
        },
        temperature: {
            warning: req.body["temperature.warning"],
            danger: req.body["temperature.danger"]
        },
        humidity: {
            warning: req.body["humidity.warning"],
            danger: req.body["humidity.danger"]
        },
        rain: {
            warning: req.body["rain.warning"],
            danger: req.body["rain.danger"]
        }
    };
    let data = JSON.stringify(alertsettings);
    fs.writeFile('alertsettings.json', data, (err) => {
        if (err) throw err;
        console.log('Data written to file alertsettings.json');
        res.redirect('alertsettings');
    });
});

app.get('/about', function (req, res) {
    res.render('about.html');
});

function ReadAlertSettingsFile() {
    let data = fs.readFileSync('alertsettings.json');
    let alertsettings = JSON.parse(data);
    console.log('Data read from file alertsettings.json');
    return alertsettings; 
}

// mqtt handlers
mqttClient.on('connect', function () {
    mqttClient.subscribe(mqttTopic, function (err) {
        if (err) {
            console.log(err.toString())
        }
    })
})

mqttClient.on('message', function (topic, buffer) {
    if (topic == mqttTopic) {
        let message = buffer.toString();
        io.emit('pile-updates', message.toString()); // This will emit the event to all connected sockets
    }
    //mqttClient.end()
})
