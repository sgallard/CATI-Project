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
router.get('/contactos', function (req, res, next) {
		try {
			/*var query = url.parse(req.url,true).query;
			 console.log(query);*/
			models.contacto.findAll().then(function (user) {
				console.log(user);
				res.render('vercontacto.html', {title: 'Lista contactos', resultado: user});
			});
		} catch (ex) {
			console.error("Internal error:" + ex);
			return next(ex);
		}
	});
router.get('/contactosproyecto/:id', function (req, res, next) {
		/*var query = url.parse(req.url,true).query;
		 console.log(query);*/
		try {
			models.proyecto_contacto.findAll({
				where: {
					idproyecto: req.params.id
				}
			}).then(function (user) {
				res.render('vercontactosproyecto.html', {resultado:user,id:req.params.id});
			});
		} catch (ex) {
			console.log("Id incorrecto.");
		}
});

router.get('/cargarencuestaproyecto/:id', function (req, res, next) {
	try {
		//console.log(req);
		models.proyecto.findOne(({
			where: {
				idproyecto: req.params.id
			}
		})).then(function (user) {
			res.render('cargarencuesta.html', {resultado: user});
		});
	} catch (ex) {
		console.log("Id incorrecto.");
	}
});
router.post('/cargarencuestaproyecto/:id', function (req, res, next) {
	try {
		console.log("Ayyyylmao")
		models.encuesta.create({
			url: req.body.URL,
			idproyecto: req.body.id_p
		});
		res.redirect('/api/proyecto/'+req.params.id);

	}
	catch (ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}
});

router.get('/contactosproyectoencuestador/:id', function (req, res, next) {
	/*var query = url.parse(req.url,true).query;
	 console.log(query);*/
	try {
		models.proyecto_contacto.findAll({
			where: {
				idproyecto: req.params.id
			}
		}).then(function (user) {
			res.render('vercontactos_encuestador.html', {resultado:user});
		});
	} catch (ex) {
		console.log("Id incorrecto.");
	}
});

router.get('/vercontacto_encuestador/:idp/:id', function(req,res,next){
	try {
		models.contacto.findAll({
			where: {
				rutcontacto: req.params.id
			}
		}).then(function (user) {
			res.render('vercontacto_encuestador.html', {resultado: user[0], id_proyecto: req.params.idp});
		});
	} catch (ex) {
		console.log("id incorrecto.");
	}
});

router.get('/verencuestadores', function (req, res, next) {
		try {
			models.encuestador.findAll().then(function (user) {
				//for(var x=0;x<user.length;x++){
				//console.log(user[x].username);
				res.render('verencuestadores.html', {title: 'Listar encuestadores', resultado: user});
			});
			//res.render('VerUsuario.html', {title: 'Listar Usuarios'});
		} catch (ex) {
			console.error("Internal error:" + ex);
			return next(ex);
		}
	});
router.get('/verllamadas/:id', function (req, res, next) {
	try {
		//console.log(req);
		models.llamada.findAll(({
			where: {
				usuarioencuestador: req.params.id
			}
		})).then(function (user) {
			res.render('verllamadas.html', {resultado: user});
		});
	} catch (ex) {
		console.log("Id incorrecto.");
	}
});
router.get('/verproyectos', function (req, res, next) {
	try {
		/*var query = url.parse(req.url,true).query;
		 console.log(query);*/
		models.proyecto.findAll().then(function (user) {
			//for(var x=0;x<user.length;x++){
			//console.log(user[x].username);
			if (req.user.usuarioadmin!=undefined){
				res.render('verproyectos.html', {title: 'Listar proyectos', resultado: user});}
			else if(req.user.usuarioencuestador!=undefined){
				res.render('verproyectosencuestador.html', {title: 'Listar proyectos', resultado: user});

			}

			//res.json(user);
			//}
		});
		//res.render('VerUsuario.html', {title: 'Listar Usuarios'});
	} catch (ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}
});

router.get('/encuestador/:id', function (req, res, next) {
		try {
			models.encuestador.findAll({
				where: {
					usuarioencuestador: req.params.id
				}
			}).then(function (user) {
				res.render('encuestador.html', {resultado: user});
			});
		} catch (ex) {
			console.log("Id incorrecto.");
		}
	});
router.get('/proyecto/:id', function (req, res, next) {
	try {
		models.proyecto.findOne({
			where: {
				idproyecto: req.params.id
			}
		}).then(function (user){
			models.encuesta.findOne({
				where: {
					idproyecto: req.params.id
				}
			}).then(function (ENC){
				res.render('proyecto.html', {resultado: user, r_encuesta: ENC});
			})
		});
	} catch (ex) {
		console.log("Id incorrecto.");
	}
});
//GET un usuario con id determinado
router.get('/usuarios/:id', function (req, res, next) {
		try {
			models.Usuario.findAll({
				where: {
					id: req.params.id
				}
			}).then(function (user) {
				res.render('vercontacto.html', {title: 'Listar Usuarios', resultado: user});
			});
		} catch (ex) {
			console.error("Internal error:" + ex);
			return next(ex);
		}
	});
router.get('/modificarproy/:id', function (req, res, next){
	try {
		models.proyecto.findAll({
			where:{
				idproyecto: req.params.id
			}
		}).then(function (user) {
			res.render("modificarproyecto.html",{resultado:user[0]});
		});
	} catch (ex) {
		console.log("ID incorrecto.");
	}
});

//POST crear usuario
router.post('/crearencuestador', function (req, res, next) {
		try {
			models.encuestador.create({
				usuarioencuestador: req.body.usuarioencuestador,
				nombre: req.body.nombre,
				contrasena: req.body.contrasena
			});
			/*.then(function (result) {
			 models.Rol.create({
			 permiso: req.body.permiso,
			 UsuarioId: result.id
			 }); }); */
			res.redirect("/verencuestadores");

		}
		catch (ex) {
			console.error("Internal error:" + ex);
			return next(ex);
		}
	});

router.post('/crearllamada/:id/:idp',function(req,res,next){
	try {
		models.llamada.create({
			usuarioencuestador: req.user.usuarioencuestador,
			rutcontacto: req.params.id,
			duracion: req.body.duracion,
			estado: req.body.estado,
			id_grabacion: req.body.id_grabacion
		});
		/*.then(function (result) {
		 models.Rol.create({
		 permiso: req.body.permiso,
		 UsuarioId: result.id
		 }); }); */
		res.redirect("/vercontactosproyectoencuestador/"+req.params.idp);

	}
	catch (ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}


});
router.post('/crearproyecto', function (req, res, next) {
    try {
        models.proyecto.create({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion
        });
        /*.then(function (result) {
         models.Rol.create({
         permiso: req.body.permiso,
         UsuarioId: result.id
         }); }); */
        res.redirect("/verproyectos");

    }
    catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});
router.put('/usuarios/:id', function (req, res, next) {
		try {


			models.Usuario.findOne({where: {id: req.params.id}}).then(function (user) {
				//for(var x=0;x<user.length;x++){
				//console.log(user.username);
				if (req.body.username) {
					if (req.body.email) {
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
		catch (ex) {
			console.error("Internal error:" + ex);
			return next(ex);
		}
	});
router.post('/modificarencuestador/:id', function (req, res, next) {
		try {
			models.encuestador.findOne({where: {usuarioencuestador: req.params.id}}).then(function (user) {

				if (req.body.usuarioencuestador	 && req.body.nombre && req.body.contrasena) {
					user.updateAttributes({
						usuarioencuestador: req.body.usuarioencuestador,
						nombre: req.body.nombre,
						contrasena: req.body.contrasena
					}).then(function (result) {
						res.redirect('/api/encuestador/'+req.body.usuarioencuestador);
					})
				}
			});
		}
		catch (ex) {
			console.error("Internal error:" + ex);
			return next(ex);
		}
	});
router.post('/modificarestado/', function (req, res, next){
	try{
		models.proyecto_contacto.findOne({
			where:{
				rutcontacto: req.body.rut_contacto,
				idproyecto: req.body.id_proyecto
			}
		}).then(function (user){
			user.updateAttributes({
				estado: req.body.nuevo_estado
			}).then(function (result){
				res.redirect('/api/contactosproyectoencuestador/'+req.body.id_proyecto);
			})
		});
	}
	catch (ex){
		console.error("Internal error:" + ex);
		return next(ex);
	}
});

router.post('/modificarproyecto/:id', function (req, res, next) {
	try {
		models.proyecto.findOne({where: {idproyecto: req.params.id}}).then(function (user) {
			console.log('enter');
			if (req.params.id	 && req.body.nombre && req.body.descripcion) {
				console.log(req.body.descripcion);
				user.updateAttributes({
					idproyecto: req.body.idproyecto,
					nombre: req.body.nombre,
					descripcion: req.body.descripcion
				}).then(function (result) {
					res.redirect('/api/proyecto/'+req.params.id);
				})


			}
		});
	}
	catch (ex) {
		console.error("Internal error:" + ex);
		return next(ex);
	}
});



router.post('/eliminarencuestador/:id', function (req, res, next) {
		try {
			console.log(req.params);
			models.encuestador.destroy({where: {usuarioencuestador: req.params.id}}).then(function () {
				return models.encuestador.findAll().then(function (user) {
					res.redirect('/api/verencuestadores');
				})
			})
		}
		catch (ex) {
			console.error("Internal error:" + ex);
			return next(ex);
		}
	});
router.post('/eliminarproyecto/:id', function (req, res, next) {
    try {console.log(req.params.id);
        models.proyecto.destroy({where: {idproyecto: req.params.id}}).then(function () {
            return models.proyecto.findAll().then(function (user) {
				res.redirect('/api/verproyectos');
            })
        })
    }
    catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});

