//Dependecies
var express = require('express');
var router= express.Router();
var mysql = require('mysql');
var url = require('url');
//var Usuario = require('../models/usuario.js');
//var Rol= require('../models/rol.js');
//var contacto= require('../models/contacto.js');
var models  = require('../models');

// Routes
/*router.get('/usuarios', function(req,res){
	res.send('api esta funcionando');
});*/

/*router.get('/', function(req,res){
	res.render('api', {title: 'Mi primer Aplicacion Web'});
});*/

//Return router
module.exports = router;


//GET contactos
router.get('/contactos', function(req, res, next) {
	try {
		/*var query = url.parse(req.url,true).query;
		 console.log(query);*/
		models.contacto.findAll().then(function (user) {
			//for(var x=0;x<user.length;x++){
			//console.log(user[x].username);
			res.render('vercontacto.html', {title: 'Listar contactos', resultado: user });
			//}
		});
	} catch (ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}
});
router.get('/verencuestadores', function(req, res, next) {
	try {
		/*var query = url.parse(req.url,true).query;
		 console.log(query);*/
		models.encuestador.findAll().then(function (user) {
			//for(var x=0;x<user.length;x++){
			//console.log(user[x].username);
			res.render('verencuestadores.html', {title: 'Listar encuestadores', resultado: user});
			//res.json(user);
			//}
		});
		//res.render('VerUsuario.html', {title: 'Listar Usuarios'});
	} catch (ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}
});

router.get('/encuestador/:id', function(req, res ,next){
	console.log(req.params.id);
	try {
		models.encuestador.findAll(({
			where: {
				usuarioencuestador: req.params.id
			}
		})).then(function (user) {
			console.log("aylmao2");
			res.render('encuestador.html', { id_usuario: req.params.id });
		});
	} catch (ex){
		console.log("Id incorrecto.");
	}
});
//GET un usuario con id determinado
router.get('/usuarios/:id', function(req, res, next) {
	try {
		//var query = url.parse(req.url,true).query;
		//console.log(query);
		console.log(req.params.id);
		models.Usuario.findAll({
			where: {
				id: req.params.id
			}
		}).then(function (user) {
			//for(var x=0;x<user.length;x++){
			//console.log(user[x].username);
			//console.log(user.get('username'));
			res.render('vercontacto.html', {title: 'Listar Usuarios', resultado: user});
			//}
		});
	} catch (ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}
});

//POST crear usuario
router.post('/crearencuestador', function(req,res,next){
try{
	console.log(req.body.permiso);
	models.encuestador.create({
		usuarioencuestador: req.body.usuarioencuestador,
		nombre: req.body.nombre,
		contrasena: req.body.contrasena
	}); /*.then(function (result) {
		models.Rol.create({
			permiso: req.body.permiso,
			UsuarioId: result.id
		}); }); */
		res.redirect("/verencuestadores");

	}
	catch(ex){
	console.error("Internal error:"+ex);
	return next(ex);
	}
});

router.put('/usuarios/:id', function(req,res,next){
	try{

		models.Usuario.findOne({ where: {id:req.params.id} }).then(function (user) {
			//for(var x=0;x<user.length;x++){
			//console.log(user.username);
			if(req.body.username){
				if(req.body.email) {
					user.updateAttributes({
						username: req.body.username,
						email: req.body.email
					}).then(function (result) {
						res.send(result);
					})
				}
				else {
					user.updateAttributes({
						username: req.body.username
					}).then(function (result) {
						res.send(result);
					})
				}

			}
		});
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});
router.get('/verproyectos', function(req, res, next) {
	try {
		/*var query = url.parse(req.url,true).query;
		 console.log(query);*/
		models.proyecto.findAll().then(function (user) {
			//for(var x=0;x<user.length;x++){
			//console.log(user[x].username);
			res.render('verproyectos.html', {title: 'Listar proyectos', resultado: user});
			//res.json(user);
			//}
		});
		//res.render('VerUsuario.html', {title: 'Listar Usuarios'});
	} catch (ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}
});



router.post('/eliminarencuestador', function(req,res,next){
	try{console.log(req.params);
		models.encuestador.destroy({where: {usuarioencuestador: req.params.usuarioencuestador} }).then(function () {
			return models.encuestador.findAll().then(function (user) {
				res.json(user);
			})
		})
	}
	catch(ex){
		console.error("Internal error:"+ex);
		return next(ex);
	}
});


