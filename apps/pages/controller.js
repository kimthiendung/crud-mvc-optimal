/**
 * Created by dungpna on 2017/09/05
 * handle router
 */
var express = require('express'),
router = express.Router();

var Promise = require('bluebird');

module.exports = function(Name, EntityName){
    var Entity = require('./model')(EntityName).model;

    /**
    * List
    */
    router.get('/list', function (req, res, next) {
        var data = require('../../helpers/data_util')(req);
        
        Entity.getAll({})
        .then(function(doc){
            data.items = doc;
            return res.render(Name + '/list', data);
        })
        .catch(function(err){
            return next();
        });
        
    })

    /**
    * Detail
    */
    router.get('/detail/:id', function (req, res, next) {
        var data = require('../../helpers/data_util')(req);

        Entity.get({_id: req.params.id})
        .then(function(doc){
            data.items = doc;
            return res.render(Name + '/detail', data);
        })
        .catch(function(err){
            return next();
        });
    });

    /**
    * New, edit form
    */
    router.get(['/new','/edit/:id'], function (req, res, next) {
        var data = require('../../helpers/data_util')(req);
        
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
                    return res.redirect('detail/'+ doc._id);
                })
                .catch(function(err){
                    return res.redirect('new');
                });
            }
            else{
                Entity.create(body)
                .then(function(doc){
                    return res.redirect('detail/'+ doc._id);
                })
                .catch(function(err){
                    return res.redirect('edit/'+ body._id);
                });
            }
        }
        catch (e) {
            return next();
        }
    });

    //exports
    return {
        router: router
    }

}