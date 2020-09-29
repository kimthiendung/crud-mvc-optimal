// load all the things we need
var _ = require("lodash");
var LocalStrategy   = require("passport-local").Strategy;

/**
 * Required oauth2
 */
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var OAuth2Refresh = require("passport-oauth2-refresh");

// load up the user model
var User = require("../apps/users/model")("users").model;

var Encode = require("../helpers/encode_util");
// expose this function to our app using module.exports
module.exports = function(passport) {

    var output = function(user){
		return {
			_id: user._id,
			username: user.username,
            email: user.email,
            roles: user.roles || {user: 1},
            actions: user.actions || {},
            groups: user.groups || {},
		};
	};

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent auth sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        return done(null, user.email);
    });

    // used to deserialize the user
    passport.deserializeUser(function(email, done) {
        var userLocal = _.find(NODE_CONFIG.USER, { "email": email });
        if(userLocal){
            return done(null, output(userLocal));
        }
        else{
            User.findOne({ "email": email } , function(err, user) {
                return done(err, user);
            });
        }
    });

    // =========================================================================
    // LOCAL auth =============================================================
    // =========================================================================
    // we are using named strategies since we have one for auth and one for signup
    // by default, if there was no name, it would just be called "local"
    var authLocal = new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        //passReqToCallback: true, // allows us to pass back the entire request to the callback
        usernameField: "email",
        passwordField: "password"
    },
    function(email, password, done) { // callback with email and password from our form
        //auth with user local
        var userLocal = _.find(NODE_CONFIG.USER, { "email": email, "password": password});
        if(userLocal){
            return done(null, output(userLocal));
        }
        else{
            User.findOne({"email": email} , function(err, user) {
                if(err){
                    return done(null, false, { message: err.message });
                }
                // if no user is found, return the message
                if (!user){
                    return done(null, false, { message: "User not found." }); // req.flash is the way to set flashdata using connect-flash
                }
                // if the user is found but the password is wrong
                if (!Encode.compare(password, user.password)){
                    return done(null, false, { message: "Error! Wrong password." });
                }
                // all is well, return successful user
                return done(null, output(user));
            
            });
        }
    });

    passport.use("auth-local", authLocal);

    // =========================================================================
    // GOOGLE AUTH =============================================================
    // =========================================================================
    var authGoogle = new GoogleStrategy({
        clientID: NODE_CONFIG.OAUTH.GOOGLE.clientID,
        clientSecret: NODE_CONFIG.OAUTH.GOOGLE.clientSecret,
        callbackURL: NODE_CONFIG.OAUTH.GOOGLE.callbackURL,
        passReqToCallback: false
      },
      function(accessToken, refreshToken, profile, done) {
        // console.log(profile)
        if(!_.isEmpty(profile)){
            var result = {
                username: profile.email,
                email: profile.email
            };
            User.findOne({"email": profile.email} , function(err, user) {
                if(err){
                    return done(null, false, { message: err.message });
                }

                if (!user){
                    result.register = true;
                }

                return done(null, result);
            });
        }
        
        return done(null, false, { message: "User not found." });

      }
    )

    passport.use('auth-google', authGoogle);
    OAuth2Refresh.use('auth-google', authGoogle);
};