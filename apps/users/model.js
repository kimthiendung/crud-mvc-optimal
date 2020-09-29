/**
 * Created by dungpna on 2017/09/05
 * handle model
 */
var Promise = require('bluebird');
var mongoose = require('mongoose');
var Encode = require('../../helpers/encode_util');
var Log = require('../../helpers/log_util');

module.exports = function(Entity){

    //mongoose check if model exists
    if(mongoose.models[Entity]){
        return {
            model: mongoose.models[Entity]
        }
    }

    /**
     * @module Collection
     * @description contain the details of Collection information, conditions and actions.
     */
    var Schema = mongoose.Schema;
    var CollectionSchema = new Schema({
        email: { type: String, unique: true },
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        status: { type: Boolean, default: true },
        token: { type: String, default: Math.random().toString(36).substr(2, 9) }, // random string token
        groups: { type: Schema.Types.Mixed, default: {} }, // ex: { 'platforms': 1 }
        roles: { type: Schema.Types.Mixed, default: {'user': 1} }, // ex: {'admin': 1, operator: 1, 'user': 1}
        actions: { type: Schema.Types.Mixed, default: {} }, // crud on entity ex: { 'user': {read: 1, write: 1} }
    });

    CollectionSchema.path('password').validate(function (v) {
        return v.length >= 6;
    });

    CollectionSchema.pre('findOneAndUpdate', function(next){
        //check password empty & string
        var update = this.getUpdate();
        if(update.password && (typeof update.password === 'string' || update.password instanceof String) ){
            update.password = Encode.hash(update.password);
        }
        next();
    });

    CollectionSchema.pre('save', function(next){
        //check password empty & string
        if(this.password && (typeof this.password === 'string' || this.password instanceof String) ){
            this.password = Encode.hash(this.password);
        }
        next();
    });

    CollectionSchema.post('save', function(err, doc, next) {
        if (err.name === 'MongoError' && err.code === 11000) {
          next(new Error('Username or email must be unique'));
        } else {
          next(err);
        }
    });

    CollectionSchema.statics = {

        /**
         * find one. return the one Collection object.
         */
        get: function (query) {
            var that = this;
            return new Promise(function(resolve, reject) {
                that.findOne(query, function(err, doc){
                    if (err) { Log.error(err.message); reject(Error(err.message)); }
                    //check data empty
                    if(doc){
                        resolve(doc);
                    }
                    reject(Error('User is empty!'));
                });
            });
        },
        
        /**
         * find all. return the Collection objects array.
         */
        getAll: function (query) {
            var that = this;
            return new Promise(function(resolve, reject) {
                that.find(query, function(err, doc){
                    if (err) { Log.error(err.message); reject(Error(err.message)); }
                    //check data empty
                    if(Object.keys(doc).length > 0){
                        resolve(doc);
                    }
                    reject(Error('Collection is empty!'));
                });
            });

        },

        create: function (data) {
            var that = this;
            return new Promise(function(resolve, reject) {
                var Collection = new that(data);
                Collection.save(function(err, doc){
                    if (!err) {
                        resolve(doc);
                    }
                    else { Log.error(err.message); reject(Error(err.message)); }
                });
            });

        },

        updateByQuery: function (query, data) {
            var that = this;
            return new Promise(function(resolve, reject) {
                that.findOneAndUpdate(query, data, function (err, doc) {
                    if (!err) {
                        var updateData = data;
                        resolve(updateData);
                    }
                    else { Log.error(err.message); reject(Error(err.message)); }
                });
            });

        },

        updateById: function (id, data) {
            var that = this;
            return new Promise(function(resolve, reject) {
                that.findOneAndUpdate({ _id: id }, data, function (err, doc) {
                    if (!err) {
                        var updateData = data;
                            updateData['_id'] = id;
                        resolve(updateData);
                    }
                    else { Log.error(err.message); reject(Error(err.message)); }
                });
            });

        },

        removeById: function (id) {
            var that = this;
            return new Promise(function(resolve, reject) {
                that.findByIdAndRemove(id, function(err, doc){
                    if (err) { Log.error(err.message); reject(Error(err.message)); }
                    if(doc){
                        resolve(doc);
                    }
                    reject(Error('Remove is empty!'));
                });
            });
            
        },
        
    }

    var model = mongoose.model(Entity, CollectionSchema, Entity);

    /** export schema */
    return {
        model: model
    }

};