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

router.get('/cargarencuestaproyecto/:id', function (req, res, next) {
	try {
		models.proyecto.findOne(({
			where: {
				idproyecto: req.params.id
			}
		})).then(function (user) {
			res.render('cargarencuesta.html', {proyecto: user,nombre: req.user.nombre});
		});
	} catch (ex) {
		console.log("Id incorrecto.");
	}
});

router.get('/cargarcontactos/:id', function (req, res, next) {
	try {
		models.proyecto.findOne(({
			where: {
				idproyecto: req.params.id
			}
		})).then(function (proyect) {
			res.render('cargarcontactos.html', {proyecto: proyect,nombre:req.user.nombre});
		});
	} catch (ex) {
		console.log("Id incorrecto.");
	}
});

router.post('/cargarencuestaproyecto/:id', function (req, res, next) {
	try {
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

router.get('/vercontacto/:id/:nmp/:idp', function(req,res,next){
    try {
        models.contacto.findOne({
            where: {
                rutcontacto: req.params.id
            }
        }).then(function (user) {
            models.llamada.findAll({
                where: {
                    rutcontacto: req.params.id
                }
            }).then(function(llam){
                res.render('vercontacto.html', {resultado: user,llamada: llam,nombrep: req.params.nmp,idproyecto: req.params.idp,nombre: req.user.nombre});
            });
        });
    } catch (ex) {
        console.log("id incorrecto.");
    }
});

router.get('/realizarencuesta/:id_p/:id_c', function(req,res,next){
	try {
		models.contacto.findOne({
			where: {
				rutcontacto: req.params.id_c
			}
		}).then(function (contact) {
			models.proyecto.findOne({
				where: {
					idproyecto: req.params.id_p
				}
			}).then(function (proyect) {
				models.encuesta.findAll({
					where: {
						idproyecto: req.params.id_p
					}
				}).then(function (ENC) {
					res.render('responder_encuesta.html', {contacto: contact, proyecto: proyect, encuesta : ENC[0],nombre: req.user.nombre});
				})
			});

		});
	} catch (ex) {
		console.log("id incorrecto.");
	}
});

router.get('/nuevocontacto/:id_p/:id_c', function(req,res,next){
	try {
		models.contacto.findOne({
			where: {
				rutcontacto: req.params.id_c
			}
		}).then(function (contact) {
			models.proyecto.findOne({
				where: {
					idproyecto: req.params.id_p
				}
			}).then(function (proyect)
				{res.render('modificarestado.html', {contacto: contact, proyecto: proyect,nombre: req.user.nombre});
			});
		});
	} catch (ex) {
		console.log("id incorrecto.");
	}
});

router.get('/usuariorandom/:id', function (req, res, next) {
	try {
		models.proyecto_contacto.findAll({
			where: {
				idproyecto: req.params.id,
				estado: {$ne : 'Encuesta finalizada'}
			}
		}).then(function (user) {
			if((user != null) && (user.length!=0) ){
				var i = Math.floor(Math.random()*user.length);
				models.contacto.findOne({
					where: {
						rutcontacto: user[i].rutcontacto
					}
				}).then(function (contacto) {
					models.proyecto.findOne({
						where: {
							idproyecto: req.params.id
						}
					}).then(function (proyect) {
						res.render('vercontacto_encuestador.html', {resultado: contacto, proyecto: proyect,nombre: req.user.nombre});
					})
				});
			}
			else{
				models.proyecto.findAll().then(function (user) {
					res.render('verproyectosencuestador.html', {title: 'Listar proyectos', resultado: user,nombre: req.user.nombre, message: "El proyecto seleccionado no tiene contactos por llamar", });
				});
			}
		});
	} catch (ex) {
		console.log("Id incorrecto.");
	}
});

router.get('/verencuestadores', function (req, res, next) {
		try {
			models.encuestador.findAll().then(function (user) {
				//for(var x=0;x<user.length;x++){
				//console.log(user[x].username);
				res.render('verencuestadores.html', {title: 'Listar encuestadores', resultado: user,nombre: req.user.nombre});
			});
			//res.render('VerUsuario.html', {title: 'Listar Usuarios'});
		} catch (ex) {
			console.error("Internal error:" + ex);
			return next(ex);
		}
	});

router.get('/verllamadas/:id', function (req, res, next) {
	try {
		models.llamada.findAll({
			where: {
				usuarioencuestador: req.params.id
			}
		}).then(function (user) {
				res.render('verllamadas.html', {resultado: user,nombre: req.user.nombre});
		});
	} catch (ex) {
		console.log("Id incorrecto.");
	}
});

router.get('/verproyectos', function (req, res, next) {
	try {
		models.proyecto.findAll().then(function (user) {
			if (req.user.usuarioadmin!=undefined){
				res.render('verproyectos.html', {title: 'Listar proyectos', resultado: user,nombre: req.user.nombre});}
			else if(req.user.usuarioencuestador!=undefined){
				res.render('verproyectosencuestador.html', {title: 'Listar proyectos', resultado: user, message: "",nombre: req.user.nombre});
			}
		});
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
			}).then(function (user) {models.llamada.findAll({
				where: {
					usuarioencuestador: req.params.id
				}
			}).then(function (call) {
				res.render('encuestador.html', {resultado: user, llamada: call,nombre: req.user.nombre});
			});
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
			models.encuesta.findAll({
				where: {
					idproyecto: req.params.id
				}
			}).then(function (ENC){
				models.proyecto_contacto.findAll({
					where: {
						idproyecto: req.params.id
					}
				}).then(function(contact){
				res.render('proyecto.html', {resultado: user, r_encuesta: ENC, contacto:contact,nombre: req.user.nombre});
				});
			});
		});
	} catch (ex) {
		console.log("Id incorrecto.");
	}
});

router.get('/contactosproyecto/:id', function (req, res, next) {
	try {
		models.proyecto_contacto.findAll({
			where: {
				idproyecto: req.params.id
			}
		}).then(function (user) {
			res.render('vercontactosproyecto.html', {resultado:user,id:req.params.id,nombre: req.user.nombre});
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
			res.render("modificarproyecto.html",{resultado:user[0],nombre: req.user.nombre});
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

router.post('/calificacion/:id/:ide',function(req,res,next){
	try {
		models.calificacion.findOne({
			where: {
				id: req.params.id,
				usuarioadmin: req.user.usuarioadmin
			}
		}).then(function (user) {
			if (user==undefined){
				models.calificacion.create({
					id: req.params.id,
					usuarioadmin: req.user.usuarioadmin,
					nota: req.body.calificacion
				});
			}
			else{
				user.updateAttributes({
					nota: req.body.calificacion
				});
			}
			res.redirect("/verllamadas/" + req.params.ide);
		});
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
router.post('/modificarestado/:id_p/:rut_c', function (req, res, next){
	try{
		models.proyecto_contacto.findOne({
			where:{
				rutcontacto: req.params.rut_c,
				idproyecto: req.params.id_p
			}
		}).then(function (user){
			user.updateAttributes({
				estado: req.body.nuevo_estado
			}).then(function (result){
				models.llamada.create({
					usuarioencuestador: req.user.usuarioencuestador,
					rutcontacto: req.params.rut_c,
					estado: req.body.estado_llamada
				});
				res.redirect('/api/usuariorandom/'+req.params.id_p);
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

router.post('/eliminarencuesta/:id/:idp', function (req, res, next) {
    try {
        console.log(req.params);
        models.encuesta.destroy({where: {idencuesta: req.params.id}}).then(function () {
            return models.encuestador.findAll().then(function (user) {
                res.redirect('/api/proyecto/'+req.params.idp);
            })
        })
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
router.post('/eliminarcontacto/:id/:idp', function (req, res, next) {
    try {
        models.contacto.destroy({where: {rutcontacto: req.params.id}}).then(function () {
            models.proyecto_contacto.destroy({where: {rutcontacto: req.params.id}}).then(function (user) {
                res.redirect('/api/proyecto/'+req.params.idp);
            })
        })
    }
    catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});


