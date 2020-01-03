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
    this.confin = config;
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

        // this.informationService = informationService;
        // this.LightbulbService = LightbulbService;
        return [informationService, LightbulbService];
    },

    getOnCharacteristicHandler(callback) {
        this.log("Called get on");
        callback(null, status)
    },

    setOnCharacteristicHandler(value, callback) {
        this.log("Called set on. Value: " + value);
        status = value;
        callback(null)
    },

    getBrightnessCharacteristicHandler(callback) {
        this.log("Called get brightness");
        callback(null, status)
    },

    setBrightnessCharacteristicHandler(value, callback) {
        this.log("Called set brightness. Value: " + value);
        status = value;
        callback(null)
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
