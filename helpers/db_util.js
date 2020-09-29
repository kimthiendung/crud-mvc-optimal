var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');

mongoose.set('debug', true); // turn on debug
mongoose.connect( NODE_CONFIG.DB.MONGODB, {
    server: { poolSize: 5 }
})
.then(function(){ console.log('Connection succeeded with database: ' + NODE_CONFIG.DB.MONGODB ) })
.catch(function(err){ console.error(err) });

var db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error"));
// db.once("open", function callback() {
//   console.log("Connection with database succeeded.");
// });

exports.db = db;