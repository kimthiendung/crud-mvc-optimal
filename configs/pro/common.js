/**
 * Created by dungpna on 2017/09/05
 */

/**
 * BASE config
 */
exports.BASE = {	
    HOST: "127.0.0.1",
    PORT: 8483,
    SALT: "$6*7&8^9mvc@#!AI",
	SESSION: 1000*60*60*24*2, //2 day
	VERSION: "20170905",
	META: {
		AUTHOR: "hadarone.com",
		TITLE: "hadarone dashboard",
		DESCRIPTION: "Report management, data analysis",
		KEYWORD: "hadarone, admin, dashboard, report",
		IMAGE: "public/img/logo.jpg",
    }
};

/**
 * DOMAIN config
 */
exports.DOMAIN = {	
    BASE : 'https://admin.hadarone.com',
    API :  'https://api.hadarone.com',
    SSL_API :  'https://api.hadarone.com',
    STATIC: 'https://static.hadarone.com',
    ADS_CDN: 'https://static.hadarone.com/ads/video',
    FTP_VIDEO: {
    	HOST: "127.0.0.1",
        PORT: 21, 
        USER: "adcdn", 
        PASS: "ad@321#"
    },
};

/**
 * DATABASE config
 */
exports.DB = {	
    MONGODB: "mongodb://127.0.0.1:27017/ktdAPI",
};

/**
 * REDIS config
 */
exports.REDIS = {	
    AD_SERVER : {HOST: "127.0.0.1", PORT: 6379},
    AD_DATA : {HOST: "127.0.0.1", PORT: 6379},
    LOCATION_DATA : {HOST: "127.0.0.1", PORT: 6379}
};

/**
 * User Local
 */
exports.USER = [
    {_id : "1000", username: "superadmin", email: "superadmin@gmail.com", password: "superadmin@6789", roles: {superadmin: 1} },
    {_id : "1001", username: "admin", email: "admin@gmail.com", password: "admin@6789", roles: {admin: 1} },
];

/**
 * Google oauth
 */
exports.OAUTH = {
    GOOGLE: {
        clientID: "438369873389-m0gobsqb949a8ae2dvadp7oc95sujh7i.apps.googleusercontent.com",
        clientSecret: "wQX9EYzW2XcCY1LalMgEw9rW",
        callbackURL: "http://admin.hadarone.com/auth/google/callback"
    },
};

/**
 * Entity actions default with roles
 */
exports.ENTITY = {
    users: {superadmin: 1, admin: 1},
    pages: {superadmin: 1, admin: 1},
};

/**
 * URL passing with roles
 */
exports.URL_PASS = {
    '/': {roles: ['*']}, //all roles and all method        
    '/user/grant/*': {roles: ['superadmin'], method: ['get', 'post']}, //with method get and post
}

/**
 * Log
 */
exports.LOG = {
    "appenders": [{
        "category":"Log",
        "filename": "temp/pro-dd-hh",
        "type": "dateFile",
        "pattern": "--dd-hh.log",
        "alwaysIncludePattern": true,
        "absolute": true,
        "maxLogSize": 10*1024*1024, // = 10Mb
        "backups": 10,
    }]
}