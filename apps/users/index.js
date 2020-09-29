/**
 * Created by dungpna on 2017/09/05
 */
module.exports = function(app, Name){
    
    // Name = 'users'; //use for folder, router, view
    var EntityName = Name; //use for collection;

    app.use( '/'+Name, require('./controller')(Name, EntityName).router );

    app.use( '/api/'+Name, require('./api')(Name, EntityName).router );

}