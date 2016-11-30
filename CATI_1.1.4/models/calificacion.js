/**
 * Created by rodrigo on 10-09-16.
 */




"use strict";
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var calificacion;
    calificacion = sequelize.define("calificacion", {

        nota: DataTypes.INTEGER
    }, {timestamps:true,
        updatedAt: false,
        classMethods: {
            associate: function (models) {
                calificacion.belongsTo(models.encuestador, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name:"usuarioencuestador",
                        allowNull: false
                    }
                });

            }
        }
    });

    calificacion.removeAttribute('id');
    return calificacion;
};
