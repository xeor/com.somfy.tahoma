"use strict";

const Homey = require('homey');
const Driver = require('../../lib/Driver');

//Driver for a io:LightIOSystemSensor device
class LightSensorDriver extends Driver {

	onInit() {
		this.deviceType = 'io:LightIOSystemSensor';
		
		/*** LUMINANCE TRIGGERS ***/
		this._triggerLuminanceMoreThan = new Homey.FlowCardTriggerDevice('change_luminance_more_than').register();
		this._triggerLuminanceMoreThan.registerRunListener((args, state) => {
			let conditionMet = state.measure_luminance > args.luminance;
			return Promise.resolve(conditionMet);
		});

		this._triggerLuminanceLessThan = new Homey.FlowCardTriggerDevice('change_luminance_less_than').register();
		this._triggerLuminanceLessThan.registerRunListener((args, state) => {
			let conditionMet = state.measure_luminance < args.luminance;
			return Promise.resolve(conditionMet);
		});

		this._triggerLuminanceBetween = new Homey.FlowCardTriggerDevice('change_luminance_between').register();
		this._triggerLuminanceBetween.registerRunListener((args, state) => {
			let conditionMet = state.measure_luminance > args.luminance_from && state.measure_luminance < args.luminance_to;
			return Promise.resolve(conditionMet);
		});

		/*** LUMINANCE CONDITIONS ***/
		this._conditionLuminanceMoreThan = new Homey.FlowCardCondition('has_luminance_more_than').register();
		this._conditionLuminanceMoreThan.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().measure_luminance > args.luminance;
			return Promise.resolve(conditionMet);
		});

		this._conditionLuminanceLessThan = new Homey.FlowCardCondition('has_luminance_less_than').register();
		this._conditionLuminanceLessThan.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().measure_luminance < args.luminance;
			return Promise.resolve(conditionMet);
		});

		this._conditionLuminanceBetween = new Homey.FlowCardCondition('has_luminance_between').register();
		this._conditionLuminanceBetween.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().measure_luminance > args.luminance_from && device.getState().measure_luminance < args.luminance_to;
			return Promise.resolve(conditionMet);
		});
	}

	triggerLuminanceMoreThan(device, tokens, state) {
		this.triggerFlow(this._triggerLuminanceMoreThan, device, tokens, state);
		return this;
	}

	triggerLuminanceLessThan(device, tokens, state) {
		this.triggerFlow(this._triggerLuminanceLessThan, device, tokens, state);
		return this;
	}

	triggerLuminanceBetween(device, tokens, state) {
		this.triggerFlow(this._triggerLuminanceBetween, device, tokens, state);
		return this;
	}
}

module.exports = LightSensorDriver;