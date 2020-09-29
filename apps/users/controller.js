/**
 * Created by dungpna on 2017/09/05
 * handle router
 */
var express = require('express'),
router = express.Router();

var Promise = require('bluebird');
var passport = require('passport');
var _ = require('lodash');
var Log = require('../../helpers/log_util');

module.exports = function(Name, EntityName){
    var Entity = require('./model')(EntityName).model;

    /**
    * List
    */
    router.get('/list', function (req, res, next) {
        var data = require('../../helpers/data_util')(req);
        data.layout= 'main-menu';
        data.META = {
            title: "List user",
            description: ""
        }

        Entity.getAll({})
        .then(function(doc){
            data.items = doc;
            return res.render(Name + '/list', data);
        })
        .catch(function(err){
            Log.error(err.message);
            return next();
        });
        
    })

    /**
    * Detail
    */
    router.get('/detail/:id', function (req, res, next) {
        var data = require('../../helpers/data_util')(req);
        data.layout= 'main-menu';
        data.META = {
            title: "Detail user",
            description: ""
        }

        Entity.get({_id: req.params.id})
        .then(function(doc){
            data.items = doc;
            return res.render(Name + '/detail', data);
        })
        .catch(function(err){
            Log.error(err.message);
            return next();
        });
    });

    /**
    * New, edit form
    */
    router.get(['/new','/edit/:id'], function (req, res, next) {
        var data = require('../../helpers/data_util')(req);
        data.layout= 'main-menu';
        data.META = {
            title: "New or edit user",
            description: ""
        }

        if(req.params.id){
            Entity.get({_id: req.params.id})
            .then(function(doc){
                data.items = doc;
                return res.render(Name + '/form', data);
            })
            .catch(function(err){
                return next();
            });
        }
        
        return res.render(Name + '/form', data);
    });

    /**
    * Save
    */
    router.post('/save', function (req, res, next) {
        try {
            var body = req.body ? req.body : {};
            if(body._id){
                Entity.updateById(body._id, body)
                .then(function(doc){
                    return res.json({ error: 0, message: 'Save success', data: doc });
                })
                .catch(function(err){
                    return res.json({ error: 1, message: err.message, data: null });
                });
            }
            else{
                delete body._id;
                Entity.create(body)
                .then(function(doc){
                    return res.json({ error: 0, message: 'Save success', data: doc });
                })
                .catch(function(err){
                    return res.json({ error: 1, message: err.message, data: null });
                });
            }
        }
        catch (err) {
            Log.error(err.message);
            return next();
        }
    });

    /**
    * Grant
    */
    router.get('/grant/:id', function (req, res, next) {
        var data = require('../../helpers/data_util')(req);

        Entity.get({_id: req.params.id})
        .then(function(doc){

            data.layout= 'main-menu';
            data.META = {
                title: "Grant permission",
                description: "Grant permission entity"
            }
            data.groups = require('../../configs/_extension/groups');
            data.items = doc;
            return res.render(Name + '/grant', data);
        })
        .catch(function(err){
            Log.error(err.message);
            return next();
        });
        
    });

    router.post('/grant', function (req, res, next) {
        try {
            var body = req.body ? req.body : {};
            var updatedata = {};

            if(body.actions){
                updatedata = {actions: body.actions}
            }
            if(body.groups){
                updatedata = {groups: body.groups}
            }

            Entity.updateByQuery({_id: body._id}, updatedata)
            .then(function(doc){
                return res.json({ error: 0, message: 'Update grant.', data: {actions: doc.actions} });
            })
            .catch(function(err){
                return res.json({ error: 1, message: err.message, data: null });
            });
        }
        catch (err) {
            Log.error(err.message);
            return next();
        }
    });

    //exports
    return {
        router: router
    }

}