/**
 * Created by rodrigo on 10-09-16.
 */



"use strict";
module.exports = function(sequelize, DataTypes) {
    var administrador = sequelize.define("administrador", {
        usuarioadmin:  {

            type: DataTypes.STRING,
            primaryKey: true
        },


        nombre: DataTypes.STRING,
        contrasena: DataTypes.STRING
    }, {
        timestamps:false
    });
    return administrador;
};
