/**
 * Enabled less secure apps. (send mail with google mail)
 * https://www.google.com/settings/security/lesssecureapps
 */

var nodemailer = require('nodemailer');
var Promise = require('bluebird');

module.exports = function(user){

    return new Promise(function(resolve, reject) {

        if(!user){
            reject(Error("Error! Receiver or token is empty."));
        }
        
        // infomation
        var backlink = NODE_CONFIG.DOMAIN.BASE + '/auth/change-password?email='+user.email+'&token='+user.token;        

        var from = 'admin ✔ <hadarone9999@gmail.com>';
        var to = user.email;
        var subject = 'Quên mật khẩu';
        var html = '<h1>New Password</h1><a href="'+backlink+'">Click and change password</a>';

        // setup mail google
        var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                auth: {
                    user: 'hadarone9999@gmail.com',
                    pass: 'Thienha9999'
                }
            });

        transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            html: html
        }, function(error, info){
            if(error){
                reject(Error(error));
            }
            else{
                resolve(info);
            }
        });
    });

};