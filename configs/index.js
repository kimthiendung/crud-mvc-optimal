module.exports = function(ENV){
    var CONFIG = require('./'+ ENV + '/common');

    /**
     * Import
     */
    var COMMON = CONFIG.BASE;
    COMMON["DB"] = CONFIG.DB;
    COMMON["DOMAIN"] = CONFIG.DOMAIN;
    COMMON["REDIS"] = CONFIG.REDIS;
    COMMON["USER"] = CONFIG.USER;
    COMMON["OAUTH"] = CONFIG.OAUTH;
    COMMON["ENTITY"] = CONFIG.ENTITY;
    COMMON["URL_PASS"] = CONFIG.URL_PASS;
    COMMON["LOG"] = CONFIG.LOG;

    // Export
    return COMMON;
}
