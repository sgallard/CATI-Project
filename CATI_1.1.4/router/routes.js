/**
 * Created by famancil on 21-08-16.
 */

module.exports = function(app, passport) {

    app.get('/', function (req, res) {
        res.render('index.html', {title: 'CATI Beta '});
    });
    app.get('/cargarcontactos', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('cargarcontactos.html', { message: req.flash('loginMessage') });
    });

    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.html', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/vercontacto', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

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
    app.get('/vercontactos', isLoggedIn, function(req, res) {
        res.render('vercontacto.html', {
            user : req.user // get the user out of session and pass to template
        });
    });
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.html', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    app.get('/vercontacto',isLoggedIn, function (req, res) {
        console.log("aca");
        res.redirect('/api/contactos');
    });

    app.get('/crearUsuario',isLoggedIn, function (req, res) {
        res.render('CrearUsuario.html', {title: 'Registrar Usuarios'});
    });
}

function isLoggedIn(req, res, next) {
    console.log("here");
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}