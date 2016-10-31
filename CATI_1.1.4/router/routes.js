
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'newpass123',
    database : 'Cati'
});


module.exports = function(app, passport) {

    app.get('/', function (req, res) {
        res.render('index.html', {title: 'CATI Beta '});
    });

    app.get('/cargarcontactos', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('cargarcontactos.html', { message: req.flash('loginMessage') });
    });

    app.get('/encuestador', function(req, res) {
        // render the page and pass in any flash data if it exists
        var id = req.query.id;
        res.redirect('/api/encuestador/'+id);
       // res.render('verencuestadores.html', {title: 'Listar encuestadores', resultado: user});
       // res.render('encuestador.html', { message: req.flash('loginMessage') });
    });

    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.html', { message: req.flash('loginMessage') });
    });
    app.get('/loginencuestador', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('loginencuestador.html', { message: req.flash('loginMessage') });
    });


    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/api/verencuestadores', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/loginencuestador', passport.authenticate('local-login-encuestador', {

        successRedirect : '/api/contactos', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    /*
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.html', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/verUsuario', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    */
    app.get('/vercontactos_encuestador', isLoggedInEncuestador  , function(req, res) {

        res.render('vercontactos_encuestador.html', {
            user : req.user // get the user out of session and pass to template
        });
    });
    app.get('/vercontactos', isLoggedInAdmin, function(req, res) {
        res.render('vercontacto.html', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/profile', isLoggedInAdmin, function(req, res) {
        res.render('profile.html', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/cargarcontactos', function(req, res) {
        var archivoContactos;
        var fs;
        var localizacion;

        if (!req.files) {
            res.send('No files were uploaded.');
            return;
        }
        archivoContactos = req.files.archivox;
        console.log(archivoContactos.name);
        localizacion = __dirname;
        localizacion = localizacion.replace('CATI_1.1.4/router','Archivos/');
        console.log(__dirname);
        console.log(localizacion);

        connection.connect();
        connection.query("LOAD DATA LOCAL INFILE '" + localizacion + archivoContactos.name + "' INTO TABLE contacto FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 ROWS;", function(err) {
            if (!err) {
                console.log('All good.');
                res.send('Se ha subido el archivo');
            }
            else
                console.log('Error while performing Query.');
            res.send('Error al subir archivo.');
        });
    });

    app.get('/vercontacto',isLoggedInEncuestador, function (req, res) {
        res.redirect('/api/contactos');
    });
    app.get('/crearencuestador',isLoggedInAdmin, function (req, res) {
        res.render('crearencuestador.html');
    });


    app.get('/verencuestadores',isLoggedInAdmin, function (req, res) {
        res.redirect('/api/verencuestadores');

    });

    app.get('/crearUsuario',isLoggedInAdmin, function (req, res) {
        res.render('crearencuestador.html', {title: 'Registrar Usuarios'});
    });
};

function isLoggedInAdmin(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.user!=undefined) {
        if (req.user.usuarioadmin != undefined)
            return next();
    }
    console.log("falso admin");
    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isLoggedInEncuestador(req, res, next) {
    // if user is authenticated in the session, carry on
    console.log(req.user);
    if (req.user!=undefined) {
        if (req.user.usuarioencuestador != undefined)
            return next();
        console.log("falso encuestador");
    }
    // if they aren't redirect them to the home page
    res.redirect('/');
}



