var _ = require('lodash');
var express = require('express'),
    router = express.Router(),
	app = express();
	
var Log = require('../helpers/log_util');

module.exports = function(config) {

	function check_roles(roles){
		return function(req, res, next){
			if(!_.isEmpty(roles)){
				for(var i in roles){
					if(roles[i] == '*' || req.user.roles[roles[i]]){
						return next();
					}
				}
			}
			// Permission denied
			return res.redirect('/403');
		};
	};
	
	for (var i in config) {
		var temp = config[i];
		if (_.isEmpty(temp.method)) {
			router.all(i, check_roles(temp.roles));
		}
		else{
			for (var j in temp.method) {
				var method = temp.method[j].toLowerCase();
				if(method == 'get' || method == 'post' || method == 'put' || method == 'delete'){
					router[method](i, check_roles(temp.roles));
				}
				else{
					Log.error('URL_PASS error config Method: '+ method);
					console.log('URL_PASS error config Method: '+ method);
				}
			}
		}
	}

	return router;
};