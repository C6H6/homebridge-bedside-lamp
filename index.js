const dgram = require('dgram');
const net = require('net');

let Service, Characteristic;

let status = false;

module.exports = (homebridge) => {
    console.log("homebridge API version: " + homebridge.version);
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory('homebridge-bedside', 'BedsideLamp', BedsideLamp)
};

function BedsideLamp(log, config) {
    this.log = log;
    this.config = config;

    this.sock = dgram.createSocket('udp4');

    const message = Buffer.from(
        'M-SEARCH * HTTP/1.1\r\n' +
        'MAN: "ssdp:discover"\r\n' +
        'ST: wifi_bulb'
    );

    this.sock.on('message', handleMessage.bind(this));
    this.sock.send(message, 0, message.length, 1982, '239.255.255.250');
}


function handleMessage(message) {
    this.data = {};
    let rows = message.toString().split('\r\n');

    this.log(rows);

    rows.forEach(row => {
        const [k, v] = row.split(': ');
        this.data[k] = v;
    });

    [this.host, this.port] = (this.data['Location'].split('//')[1]).split(":");
    this.log(this.host, this.port);
}


BedsideLamp.prototype = {
    getServices: function () {
        let informationService = new Service.AccessoryInformation();

        let LightbulbService = new Service.Lightbulb;

        LightbulbService
            .getCharacteristic(Characteristic.On)
            .on('get', this.getOnCharacteristicHandler.bind(this))
            .on('set', this.setOnCharacteristicHandler.bind(this));

        LightbulbService
            .getCharacteristic(Characteristic.Brightness)
            .on('get', this.getBrightnessCharacteristicHandler.bind(this))
            .on('set', this.setBrightnessCharacteristicHandler.bind(this));

        LightbulbService
            .getCharacteristic(Characteristic.Hue)
            .on('get', this.getHueCharacteristicHandler.bind(this))
            .on('set', this.setHueCharacteristicHandler.bind(this));

        LightbulbService
            .getCharacteristic(Characteristic.Saturation)
            .on('get', this.getSaturationCharacteristicHandler.bind(this))
            .on('set', this.setSaturationCharacteristicHandler.bind(this));

        LightbulbService
            .getCharacteristic(Characteristic.ColorTemperature)
            .on('get', this.getColorTemperatureCharacteristicHandler.bind(this))
            .on('set', this.setColorTemperatureCharacteristicHandler.bind(this));

        return [informationService, LightbulbService];
    },

    getConnection() {
        if (!this.connection || this.connection.destroyed) {
            this.connection = net.connect(this.port, this.host);
        }

        return this.connection
    },

    getOnCharacteristicHandler(callback) {
        this.log("Called get on");
        let value = this.data['power'] === 'on';
        callback(null, value)
    },

    setOnCharacteristicHandler(value, callback) {
        let conn = this.getConnection();

        const req = {
            id: 1,
            method: 'set_power',
            params: [value ? 'on' : 'off', 'smooth', 100],
        };

        const msg = JSON.stringify(req);
        conn.write(msg + '\r\n');

        this.data['power'] = value;
        callback(null)
    },

    getBrightnessCharacteristicHandler(callback) {
        callback(null, parseInt(this.data['bright']))
    },

    setBrightnessCharacteristicHandler(value, callback) {
        let conn = this.getConnection();
        value = parseInt(value);

        const req = {
            id: 1,
            method: 'set_bright',
            params: [parseInt(value), 'smooth', 100],
        };

        const msg = JSON.stringify(req);
        conn.write(msg + '\r\n');

        this.data['bright'] = value;
        callback(null);
    },

    getSaturationCharacteristicHandler(callback) {
        this.log("Called get hue");
        callback(null, status)
    },

    setSaturationCharacteristicHandler(value, callback) {
        this.log("Called set hue. Value: " + value);
        status = value;
        callback(null)
    },

    getHueCharacteristicHandler(callback) {
        this.log("Called get hue");
        callback(null, status)
    },

    setHueCharacteristicHandler(value, callback) {
        this.log("Called set hue. Value: " + value);
        status = value;
        callback(null)
    },

    getColorTemperatureCharacteristicHandler(callback) {
        this.log("Called get color/temperature");
        callback(null, status)
    },

    setColorTemperatureCharacteristicHandler(value, callback) {
        this.log("Called set color/temperature. Value: " + value);
        status = value;
        callback(null)
    },
};
