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

        let switchService = new Service.Switch;
        switchService
            .getCharacteristic(Characteristic.On)
            .on('get', this.getOnCharacteristicHandler.bind(this))
            .on('set', this.setOnCharacteristicHandler.bind(this));

        this.informationService = informationService;
        this.switchService = switchService;
        return [informationService, switchService];
    },

    getOnCharacteristicHandler(callback) {
        this.log("Called get");
        callback(null, status)
    },

    setOnCharacteristicHandler(value, callback) {
        this.log("Called get. Value: " + value);
        status = value;
        callback(null)
    }
};
