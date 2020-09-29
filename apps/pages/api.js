/**
 * Created by dungpna on 2017/09/05
 * handle router api
 */
var express = require('express'),
router = express.Router();

var Promise = require('bluebird');

module.exports = function(Name, EntityName){
    var Entity = require('./model')(EntityName).model;

    /**
     * Get all
     */
    router.get('/', function (req, res) {

        Entity.getAll({})
        .then(function(doc){
            return res.json({ error: 0, message: 'Get all success', data: doc });
        })
        .catch(function(err){
            return res.json({ error: 1, message: err.message, data: null });
        });
        
    })

    /**
     * create
     */
    router.post('/', function (req, res) {

        Entity.create(req.body)
        .then(function(doc){
            return res.json({ error: 0, message: 'Create success', data: doc });
        })
        .catch(function(err){
            return res.json({ error: 1, message: err.message, data: null });
        });

    });

    /**
     * get by id
     */
    router.get('/:id', function (req, res) {

        Entity.get({_id: req.params.id})
        .then(function(doc){
            return res.json({ error: 0, message: 'Get by id success', data: doc });
        })
        .catch(function(err){
            return res.json({ error: 1, message: err.message, data: null });
        });
    });


    /**
     * update
     */
    router.put('/:id', function (req, res) {
        Entity.updateById(req.params.id, req.body)
        .then(function(doc){
            return res.json({ error: 0, message: 'Update success', data: doc });
        })
        .catch(function(err){
            return res.json({ error: 1, message: err.message, data: null });
        });
    });

    /**
     * delete
     */
    router.delete('/:id', function (req, res) {
        Entity.removeById(req.params.id)
        .then(function(doc){
            return res.json({ error: 0, message: 'Delete success', data: doc });
        })
        .catch(function(err){
            return res.json({ error: 1, message: err.message, data: null });
        });
    });

    return {
        router: router
    }

}