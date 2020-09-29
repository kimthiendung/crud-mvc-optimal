//symmetric-key algorithms
var pbkdf2 = require('pbkdf2');

exports.hash = function(password) {
    return pbkdf2.pbkdf2Sync(password, NODE_CONFIG.SALT, 1, 32, 'sha512');
};

exports.compare = function(password, hash) {
	return pbkdf2.pbkdf2Sync(password, NODE_CONFIG.SALT, 1, 32, 'sha512') == hash;
};