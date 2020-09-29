/**
 * Created by dungpna on 2017/09/05
 * handle router api
 */
var express = require('express'),
router = express.Router();

var Promise = require('bluebird');
var passport = require('passport');

module.exports = function(Name, EntityName){
    var Entity = require('./model')(EntityName).model;

    /**
     * login
     */
    router.get('/', function (req, res, next) {
        if(req.isAuthenticated()){
            return res.redirect('/');
        }
        var data = require('../../helpers/data_util')(req);
        data.layout= 'main-clean';
        data.META = {
            title: "login page",
            description: "login form with google or admin hadarone"
        }
        
        return res.render(Name + '/auth', data);
    });

    router.post('/', function (req, res, next) {
        passport.authenticate('auth-local', function(err, user, info) {
            if (err) { return next(err); } 
            if (!user) {
                return res.json({ error: 1, message: info.message, data: null });
            }
            else{
                req.logIn(user, function(err) {
                    if (err) { return next(err); }
                    return res.json({ error: 0, message: 'Login success! Waitting 2s redirect.', data: user });
                });
            }
        })(req, res, next);
    });


    /**
     * login with google
     */
    router.get('/google', function (req, res, next) {
        passport.authenticate('auth-google', { scope: ['email'] } )(req, res, next);
    });

    router.get('/google/callback', function (req, res, next) {
        
        passport.authenticate('auth-google', function(err, user, info) {
            
            if (err) { return next(err); } 
            if (user) {
                if (user.register){
                    return res.redirect('/auth/register/'+user.email);
                }
                else{
                    req.logIn(user, function(err) {
                        if (err) { return next(err); }
                        return res.send('<script>window.close();</script>');
                    });
                }
            }
        })(req, res, next);

    });


    /**
     * logout
     */
    router.get('/logout', function (req, res, next) { 
        req.logout();
        return res.redirect('/auth');
    });

    
    /**
     * register
     */
    router.get('/register/:email', function (req, res, next) {
        var data = require('../../helpers/data_util')(req);
        data.layout= 'main-clean';
        data.META = {
            title: "login page",
            description: "login form with google or admin hadarone"
        }
        data.items = {email: req.params.email, username: req.params.email};

        res.render(Name + '/register', data);
    });

    router.post('/register', function (req, res, next) {
        
        try {
            var body = req.body ? req.body : {};
            Entity.create(body)
            .then(function(doc){
                return res.json({ error: 0, message: 'Save success! Waitting 2s redirect.', data: doc });
            })
            .catch(function(err){
                return res.json({ error: 1, message: err.message, data: null });
            });
        }
        catch (err) {
            return next();
        }

    });
    
    
    // forget
    router.get('/forgot', function (req, res, next) {
        var data = require('../../helpers/data_util')(req);
        data.layout= 'main-clean';
        data.META = {
            title: "login page",
            description: "login form with google or admin hadarone"
        }
        
        res.render(Name + '/forgot', data);
    })

    router.post('/forgot', function (req, res, next) {

        Entity.get({email: req.body.email})
        .then(function(user){
            return new Promise(function(resolve, reject) {
                resolve(user);
                res.json({ error: 0, message: 'Please! check email change password', data: user.email });
            })
        })
        .then(function(user){
            var SendMail = require('../../helpers/gmail_util')(user);
            SendMail.then(function(data){
                return console.log("Send mail success");
            })
            .catch(function(err){
                return console.log(err.message);
            });  
        })
        .catch(function(err){
            return res.json({ error: 1, message: err.message, data: null });
        });

    });

    router.get('/change-password', function (req, res, next) {
        var data = require('../../helpers/data_util')(req);
        data.layout= 'main-clean';
        data.META = {
            title: "Change password page",
            description: "Change password"
        }
        
        res.render(Name + '/change-password', data);
    });

    router.post('/change-password', function (req, res, next) {
        try {
            var body = req.body ? req.body : {};
            var query = {email: body.email, token: body.token};
            var data = {
                token: Math.random().toString(36).substr(2, 9),
                password: body.password
            };
            
            Entity.updateByQuery(query, data)
            .then(function(doc){
                return res.json({ error: 0, message: 'Update password success.', data: {token: doc.token} });
            })
            .catch(function(err){
                return res.json({ error: 1, message: err.message, data: null });
            });
        }
        catch (err) {
            return next();
        }
    });

    return {
        router: router
    }
}