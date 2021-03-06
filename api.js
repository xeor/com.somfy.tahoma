'use strict';

const Homey = require('homey');
var Tahoma = require('./lib/Tahoma');

module.exports = [
	{
		description: 'Authenticate TaHoma',
		method: 'POST',
		path: '/login/',
		fn: function(args, callback) {
			Tahoma.login(args.body.username, args.body.password)
			.then(result => {
				Homey.ManagerSettings.set('username', args.body.username);
				Homey.ManagerSettings.set('password', args.body.password);
				callback(null, result);
			})
			.catch(error => {
				console.log(error.message, error.stack);
			});
		}
	}
];