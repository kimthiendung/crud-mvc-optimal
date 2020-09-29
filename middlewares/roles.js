var Log = require('../helpers/log_util');

module.exports = function(req, res, next) {
    
    if(typeof (req.user) === 'undefined'){
        return res.redirect('/401');
    }

    if(typeof (req.user.roles) === 'undefined'){
        return res.redirect('/403');
    }

    var actions = {};
    for(var i in NODE_CONFIG.ENTITY){
        var roles = NODE_CONFIG.ENTITY[i];
        for(var j in roles){
            if(req.user.roles[j]){
                actions[i] = {read: 1, write: 1};
            }
        }
    };
    //Extending actions entity
    req.ENTITY = Object.assign(actions, req.user.actions);

        
    // Log behavior user
    Log.info(req.method, req.path, req.user._id, req.user.username);
    
    /**
     * Check router passing from roles middlewares
     */
    if(req.user.roles["admin"] && req.path.indexOf("/user/grant") == -1){
        return next();
    }
    if(req.user.roles["superadmin"]){
        return next();
    }


    //passing next router
    return next();

};