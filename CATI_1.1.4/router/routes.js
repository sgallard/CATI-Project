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

    app.get('/cargarcontactos/:id', isLoggedInAdmin  , function(req, res) {
        res.redirect('/api/cargarcontactos/'+req.params.id+'');
    });

    app.get('/encuestador', function (req, res) {
        // render the page and pass in any flash data if it exists
        var id = req.query.id;
        res.redirect('/api/encuestador/' + id);
        // res.render('verencuestadores.html', {title: 'Listar encuestadores', resultado: user});
        // res.render('encuestador.html', { message: req.flash('loginMessage') });
    });

    app.get('/login', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.html', {message: req.flash('loginMessage')});
    });
    app.get('/loginencuestador', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('loginencuestador.html', {message: req.flash('loginMessage')});
    });

    app.get('/download/:id',isLoggedInAdmin, function(req, res){

        localizacion = __dirname;
        localizacion = localizacion.replace('CATI_1.1.4/router','Archivos/Audios/2016-11-29/');
        var file = localizacion + req.params.id;
        res.download(file); // Set disposition and send it.
    });

    app.get('/audios',isLoggedInAdmin,function (req,res) {
            res.render('audios.html',{message: "",nombre: req.user.nombre});
        });

    app.post('/audios',isLoggedInAdmin,function (req,res) {
            var fs = require('fs');
            localizacion = __dirname;
            localizacion = localizacion.replace('CATI_1.1.4/router','Archivos/Audios/'+req.body.fecha+'/');
            var direc= 0;
            if(req.body.fecha==""){
                direc=1;
            }
            try{
                var files = fs.readdirSync(localizacion);
                res.render('audioslista.html',{ls: files, date: req.body.fecha, directorio: direc,nombre: req.user.nombre});
            }catch (ex){
                res.render('audios.html',{message:"No hay audios grabados para la fecha "+req.body.fecha,nombre: req.user.nombre});
            }
        });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/api/verencuestadores', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.post('/loginencuestador', passport.authenticate('local-login-encuestador', {

        successRedirect: '/api/verproyectos', // redirect to the secure profile section
        failureRedirect: '/loginencuestador', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    app.get('/vercontactos', isLoggedInAdmin, function (req, res) {
        res.redirect('/api/contactos');
    });

    app.get('/profile', isLoggedInAdmin, function (req, res) {
        res.render('profile.html', {
            user: req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/cargarcontactos/:id', function (req, res) {
        var archivoContactos;
        var fs;
        var localizacion;
        try{
        if (!req.files) {
            res.send('No files were uploaded.');
            return;
        }
        archivoContactos = req.files.archivox;
        console.log(archivoContactos.name);
        localizacion = __dirname;
        localizacion = localizacion.replace('CATI_1.1.4/router', 'Archivos/Contactos/');
        connection.connect();
        try{
        connection.query("LOAD DATA LOCAL INFILE '" + localizacion + archivoContactos.name + "' INTO TABLE contacto FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 ROWS ;", function (err) {
            if (!err) {
                console.log('All good.');
            }
            else {
                console.log('Error while performing Query.');
                res.send('Error al subir archivo.');
            }
        });}
        catch (exx){
            console.log("Catch exx");
            res.redirect('/api/proyecto/' + req.params.id + '');
        }
        connection.query("LOAD DATA LOCAL INFILE '" + localizacion + archivoContactos.name + "' INTO TABLE proyecto_contacto FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 ROWS  (@col1,@col2,@col3,@col4)  set   `estado` = 'Disponible' , `rutcontacto` = @col1 , `idproyecto` = '" + req.params.id + "'", function (err) {
            if (!err) {
                console.log('All good.');
            }
            else {
                console.log('Error while performing Query.');
                res.send('Error al subir archivo.');
            }
        });
        connection.end();
        res.redirect('/api/proyecto/' + req.params.id + '');
        }
        catch (ex){
            console.log("No funca");
            res.redirect('/api/proyecto/' + req.params.id + '');
        }
    });

    app.get('/realizarencuesta/:id_p/:id_c', isLoggedInEncuestador  , function(req, res) {
        res.redirect('/api/realizarencuesta/'+req.params.id_p+'/'+req.params.id_c+'');
    });

    app.get('/vercontactosproyectoencuestador/:id', isLoggedInEncuestador  , function(req, res) {
        res.redirect('/api/contactosproyectoencuestador/'+req.params.id+'');
    });

    app.get('/usuariorandom/:id', isLoggedInEncuestador  , function(req, res) {
        res.redirect('/api/usuariorandom/'+req.params.id+'');
    });

    app.get('/verllamadas/:id',isLoggedInAdmin, function (req, res) {
        res.redirect('/api/verllamadas/'+req.params.id+'');
    });
    app.get('/vercontactosproyecto/:id',isLoggedInAdmin, function (req, res) {
        res.redirect('/api/contactosproyecto/'+req.params.id+'');
    });

    app.get('/cargarencuestaproyecto/:id',isLoggedInAdmin, function (req, res) {
        res.redirect('/api/cargarencuestaproyecto/'+req.params.id+'');
    });
    app.get('/verproyecto/:id',isLoggedInAdmin, function (req, res) {
        res.redirect('/api/proyecto/'+req.params.id);
    });
    app.get('/crearencuestador',isLoggedInAdmin, function (req, res) {
        res.render('crearencuestador.html',{nombre: req.user.nombre});
    });
    app.get('/crearproyecto',isLoggedInAdmin, function (req, res) {
        res.render('crearproyecto.html',{nombre: req.user.nombre});
    });

    app.get('/modificarencuestador/:id',isLoggedInAdmin, function (req, res) {
        res.render('modificarencuestador.html',{usuarioencuestador: req.params.id,nombre: req.user.nombre});
    });
    app.get('/modificarproyecto/:id',isLoggedInAdmin, function (req, res) {
        res.redirect('/api/modificarproy/'+req.params.id);
    });
    app.post('/modificarencuestador/:id',isLoggedInAdmin, function (req, res) {
        res.redirect('/api/modificarencuestador/'+req.params.id);
    });

    app.get('/calificarencuestador/:id/:msg',isLoggedInAdmin, function (req, res) {
        res.redirect('/api/calificarencuestador/'+req.params.id+'/'+req.params.msg);
    });

    app.get('/verencuestadores',isLoggedInAdmin, function (req, res) {
        res.redirect('/api/verencuestadores');
    });

    app.get('/crearUsuario',isLoggedInAdmin, function (req, res) {
        res.render('crearencuestador.html', {title: 'Registrar Usuarios',nombre: req.user.nombre});
    });
    app.get('/verproyectos',isLoggedInAdmin, function (req, res) {
        res.redirect('/api/verproyectos');

    });
    app.get('/vercontacto_encuestador/:idp/:id',isLoggedInEncuestador, function(req, res){
        res.redirect('/api/vercontacto_encuestador/'+req.params.idp+'/'+req.params.id);
    });

    app.get('/nuevocontacto/:id_p/:rut_c', function(req, res){
        res.redirect('/api/nuevocontacto/'+req.params.id_p+'/'+req.params.rut_c);
    });

    app.get('/modificarestado/:idp/:id', function (req, res) {
        res.render('modificarestado.html', {id_proyecto:req.params.idp, rut_contacto: req.params.id,nombre: req.user.nombre});
    });
};

function isLoggedInAdmin(req, res, next) {
    if (req.user!=undefined) {
        if (req.user.usuarioadmin != undefined)
            return next();
    }
    console.log("falso admin");
    res.redirect('/');
}

function isLoggedInEncuestador(req, res, next) {
    if (req.user!=undefined) {
        if (req.user.usuarioencuestador != undefined)
            return next();
        console.log("falso encuestador");
    }
    res.redirect('/');
}



