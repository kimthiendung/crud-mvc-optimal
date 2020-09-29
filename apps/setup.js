/**
 * library needed
 */
var express = require('express'),
    app = express();
    var bodyParser = require('body-parser');
    var cookieParser = require('cookie-parser');
    var expressSession = require('express-session');
    var exphbs = require('express-handlebars');
    var i18n = require('i18n');

module.exports = function(configs = {}, plugins = {}, extend = null){

    /**
    * setup basic
    */
    app.use(express.static(NODE_ROOT + '/public/'));
    app.disable('x-powered-by');

    app.set('views', NODE_ROOT + '/views');
    app.set('view engine', '.hbs');
    app.engine('.hbs', exphbs({
        defaultLayout: 'main',
        extname: '.hbs',
        layoutsDir: 'views/layouts',
        partialsDir: 'views/partials',
        helpers: {
            __formatCurrency: function (value) {
                if (typeof value != 'undefined') {
                    return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                }
                return value;
            },
            __json: function (value) { return JSON.stringify(value); },
            //i18n
            __: function () { return i18n.__.apply(this, arguments); },
            __n: function () { return i18n.__n.apply(this, arguments); }
        }
    }));

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(expressSession({
        cookie: {
            path: '/', httpOnly: true, maxAge: configs.SESSION
        },
        secret: configs.SALT,
        resave: false,
        saveUninitialized: true,
    }));

    /**
     * i18n settings
     */
    /**
     * i18n settings
     */
    try{
        i18n.configure({
            objectNotation: true,
            cookie: 'locale',
            locales: ['en', 'vi'],
            fallbacks: { 'en': 'vi' },
            defaultLocale: 'en',
            cookie: 'locale',
            queryParameter: 'lang',
            directory: NODE_ROOT + '/configs/_locales',
            directoryPermissions: '755', //default 755
            syncFiles: false,
            autoReload: false,
            updateFiles: false,
            api: {
                '__': '__',  //now req.__ becomes req.__
                '__n': '__n' //and req.__n can be called as req.__n
            },
            // setting of log level ERROR - default to require('debug')('i18n:error') 
            logErrorFn: function (msg) {
                console.log('error', msg);
            },
        });
        app.use(i18n.init);
    }
    catch(err){
        console.log(err)
    }

    /**
     * allow cross-origin
     */
    var cors = require('cors')
    app.use(cors());

    /**
     * passport setup
     */
    var passport = require('passport');
    app.use(passport.initialize());
    app.use(passport.session());
    require('../middlewares/passport')(passport); // pass passport for configsuration

    /**
     * log requests to the console
     */
    if (NODE_ENV == "dev") {
        var morgan = require('morgan');
        app.use(morgan('dev'));
    }

    /**
    * connect database
    */
    var db = require('../helpers/db_util');

    /** load routes*/
    require('./routes')(app);

    // optional extend app
    if (extend) {
        extend(app);
    }

    app.listen(process.env.PORT || configs.PORT, function(){
        console.log('\x1b[32m', ' >> App started: --HOST:' + configs.HOST+ ' --PORT:' + configs.PORT);
        console.log('\x1b[32m', ' >> ENVIROMENT: ' + NODE_ENV + ' --MEMORY: [ ' + process.memoryUsage().rss, ']', '\n \x1b[0m');
    });

    return app;

}