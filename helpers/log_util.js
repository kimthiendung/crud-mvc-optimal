var log4js = require('log4js');
log4js.configure(NODE_CONFIG.LOG);

module.exports = log4js.getLogger('Log');