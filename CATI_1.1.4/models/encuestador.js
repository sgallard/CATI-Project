/**
 * Created by rodrigo on 10-09-16.
 */


"use strict";
module.exports = function(sequelize, DataTypes) {
    var encuestador = sequelize.define("encuestador", {

        usuarioencuestador:  {
            type: DataTypes.STRING,
            primaryKey: true
        },
        nombre: DataTypes.STRING,
        contrasena: DataTypes.STRING
    }, {
        timestamps:false,
        classMethods: {
            associate: function(models) {
                encuestador.hasMany(models.llamada,{ foreignKey: {
                    name: 'usuarioencuestador',
                    allowNull: false
                } });

                encuestador.hasMany(models.calificacion,{ foreignKey: {
                    name: 'usuarioencuestador',
                    allowNull: false
                } });

            }
        }
    });
    return encuestador;
};
