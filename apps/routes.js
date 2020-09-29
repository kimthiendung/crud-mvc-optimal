/**
 * Created by dungpna on 2017/09/05
 * handle all router
 */
module.exports = function(app){

    /**
     * the routes does not need authentication
     */
    app.get('/ping', function(req, res){
        res.send('PONG');
    });

    app.get('/401', function(req, res){
        var data = require('../helpers/data_util')(req);
        data.layout = 'main-clean';
        var description = '<p>Unauthorized</p>'+
                        '<a class="ui button blue" href="/auth">Login</a>';
        data.page = {
            title: '401',
            description: description
        }
        res.render('page-message', data);
    });

    app.get('/403', function(req, res){
        var data = require('../helpers/data_util')(req);
        data.layout = 'main-clean';
        var description = '<p>Forbidden ! Permission denied</p>'+
        '<a class="ui button blue" href="/">Redirect Home</a>';
        data.page = {
            title: '403',
            description: description
        }
        res.render('page-message', data);
    });

    app.get('/404', function(req, res){
        var data = require('../helpers/data_util')(req);
        data.layout = 'main-clean';
        var description = '<p>Page Not Found</p>'+
        '<a class="ui button blue" href="/">Redirect Home</a>';
        data.page = {
            title: '404',
            description: description
        }
        res.render('page-message', data);
    });

    app.get('/locales/:name', function(req, res, next){
        // res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.cookie('locale', req.params.name || 'en' , { maxAge: 900000, httpOnly: true });
        res.redirect('back');
    });
    

    require('./hub/index')(app, 'hub');    

    /**
     * login, logout, register, forget
     */
    app.use('/auth', require('./users/auth')('users','users').router);

    
    /**
     * middle roles and url passing
     */
    app.use(require('../middlewares/roles'));
    app.use(require('../middlewares/url_pass')(NODE_CONFIG.URL_PASS));

    /**
     * router authetication
     */
    app.get('/', function(req, res){
        var data = require('../helpers/data_util')(req);
        data.layout = 'main-menu';
        return res.render('home', data);
    });


    /**
     * import router
     */
    for(var i in NODE_CONFIG.ENTITY){
        require('./' + i + '/index')(app, i);
    };
    
    /**
     * page not found all router error
     */
    app.get('*', function(req, res) {
        return res.redirect('/404');
    });

}