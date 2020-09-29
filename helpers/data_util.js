/**
 * Created by dungpna on 2017/09/05
 */

module.exports = function(req){
    
    var data = {};
    data.META = NODE_CONFIG.META;
    data.VERSION = NODE_CONFIG.VERSION;
    data.DOMAIN = NODE_CONFIG.DOMAIN;
    data.USER = req.user || null;
    data.ENTITY = req.ENTITY || {};
    data.LOCALE = (req.locale == "en") ? {"en": 1} : {"vi": 1};

    return data;
}