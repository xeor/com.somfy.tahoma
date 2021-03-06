"use strict";

const Homey = require('homey');
const Device = require('./Device');
const Tahoma = require('./Tahoma');

class WindowCoveringsDevice extends Device {

	onInit() {
		this.windowcoveringsStateMap = {
			up: 'open',
			idle: null,
			down: 'close'
		};

        this.registerCapabilityListener('windowcoverings_state', this.onCapabilityWindowcoveringsState.bind(this));
   		super.onInit();
	}

	onCapabilityWindowcoveringsState(value, opts, callback) {
		var _this = this;
		var deviceData = this.getData();
		var oldWindowCoveringsState = this.getState().windowcoverings_state;
		if (oldWindowCoveringsState != value) {
			if (value == 'idle' && this.getStoreValue('executionId')) {
				Tahoma.cancelExecution(this.getStoreValue('executionId'), function(err, result) {
					if (!err) {
						//let's set the state to open, because Tahoma, doesn't have an idle state. If a blind isn't closed for 100%, the state will remain open.
						_this.setCapabilityValue('windowcoverings_state', value);
						if (callback) {
							callback(null, value);
						}
					}
				});
			} else if(!(oldWindowCoveringsState == 'idle' && opts.fromCloudSync == true)) {
				var action = {
					name: _this.windowcoveringsStateMap[value],
					parameters: []
				};

				if (!opts.fromCloudSync) {
					Tahoma.executeDeviceAction(deviceData.label, deviceData.deviceURL, action, function(err, result) {
						if (!err) {
							_this.setStoreValue('executionId', result.execId);
							_this.setCapabilityValue('windowcoverings_state', value);
							if (callback) {
								callback(null, value);
							}
						}
					});
				} else {
					_this.setCapabilityValue('windowcoverings_state', value);
				}
			}
		}
	}

	sync(data) {
		let device;

		for (let i=0; i<data.length; i++) {
			if (this.getData().id == data[i].oid) {
				device = data[i];
				continue;
			}
		}

		if (device) {
			//device exists -> let's sync the state of the device
			let closureState, openClosedState,
				states = device.states;

			const statesMap = {
				open: 'up',
				closed: 'down'
			};

			for (let i=0; i<states.length; i++) {
				if (states[i].name == 'core:ClosureState') {
					closureState = states[i].value;
				}
				if (states[i].name == 'core:OpenClosedState') {
					openClosedState = states[i].value;
				}
			}

			this.log(this.getName(), 'state', statesMap[openClosedState]);
			this.triggerCapabilityListener('windowcoverings_state', statesMap[openClosedState], {
				fromCloudSync: true
			});
		} else {
			//device was not found in TaHoma response -> remove device from Homey
			this.setUnavailable(null);
		}
	}
}

module.exports = WindowCoveringsDevice;