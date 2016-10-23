/**
 * Created by famancil on 21-08-16.
 */
// config/passport.js
//var Usuario= require('./models/usuario');
//var Sequelize = require('sequelize');

var models  = require('../models');

var tipo;
// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'newpass123'
});

connection.query('USE Cati');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log("serialais");
        if(user.usuarioadmin){
            tipo="admin";
            done(null, user.usuarioadmin);}
        else if(user.usuarioencuestador){
            tipo="encuestador";
            done(null, user.usuarioencuestador);}


    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("select * from `encuestador` WHERE `usuarioencuestador` = '"+id+"'",function(err,rows){
            if  (rows[0]==undefined && tipo=="admin"){
                console.log("admin");
                connection.query("select * from `administrador` WHERE `usuarioadmin` = '"+id+"'",function(err,rows){
                    done(err, rows[0]);

                });
            }
            else{
                console.log("encuestador");
                done(err, rows[0]);}
        });
    });


    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    /*passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email

            usernameField : 'usuarioadmin',
            passwordField : 'contrasena',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, usuarioadmin, contrasena, done) {

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("select * from administrador where usuarioadmin = '"+usuarioadmin+"'",function(err,rows){

                //console.log("above row object");
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'Este usuario ya existe.'));
                } else {

                    // if there is no user with that email
                    // create the user
                    var newUserMysql = new Object();
                    newUserMysql.usuarioadmin    = usuarioadmin;
                    newUserMysql.contrasena = contrasena; // use the generateHash function in our user model

                    //var insertQuery = "INSERT INTO Usuario (username,email, password ) values (''famancil'+" + email +"','"+ password +"')";

                    models.administrador.create({
                        usuarioadmin: usuarioadmin,
                        contrasena: contrasena,
                        email: email
                    }).then(function (result) {
                        console.log(result);
                        newUserMysql.usuarioadmin = result.usuarioadmin;

                        return done(null, newUserMysql);
                    });
                    /*console.log(insertQuery);
                    connection.query(insertQuery,function(err,rows){
                        console.log(rows);
                        newUserMysql.id = rows.id;

                        return done(null, newUserMysql);
                    });
                }
            });
        }));*/

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'usuario',
            passwordField : 'contraseña',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM `administrador` WHERE `usuarioadmin` = '" + username + "'",function(err,rows){

                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'admin no encontrado.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!( rows[0].contrasena == password))
                    return done(null, false, req.flash('loginMessage', 'Oops! contrasena erronea.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);

            });



        }));

    passport.use('local-login-encuestador', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'usuario',
            passwordField : 'contraseña',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM `encuestador` WHERE `usuarioencuestador` = '" + username + "'",function(err,rows){

                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'encuestador no encontrado.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!( rows[0].contrasena == password))
                    return done(null, false, req.flash('loginMessage', 'Oops! contraseña erronea.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);

            });



        }));




    /*passport.use('cargar-contactos', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            archiveField : 'archivo',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },

        function(req, archive, done) { // callback with email and password from our form
            connection.query("LOAD DATA LOCAL INFILE" + archive + "INTO TABLE usuario FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 ROWS;", function(err) {
                if (!err)
                    console.log('All good.');
                else
                    console.log('Error while performing Query.');
            });

        }));
        */

};