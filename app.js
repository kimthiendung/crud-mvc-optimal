/**
 * Golbal variable
 */
var path = require('path');
global.NODE_ENV = process.env.NODE_ENV || "pro";
global.NODE_CONFIG = require('./configs/index.js')(NODE_ENV);
global.NODE_ROOT = path.resolve(__dirname); //PATH ROOT

/**
 * run configs, plugins, extend
 */
var run = require('./apps/setup')(NODE_CONFIG);