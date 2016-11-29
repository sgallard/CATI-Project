/**
 * Created by rodrigo on 10-09-16.
 */




"use strict";
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var calificacion;
    calificacion = sequelize.define("calificacion", {

        nota: DataTypes.INTEGER
    }, {        timestamps:false,

        classMethods: {
            associate: function (models) {
                calificacion.belongsTo(models.llamada, {
                    onDelete: "CASCADE",
                    foreignKey: {

                        name:"id",
                        allowNull: false
                    }
                });

                calificacion.belongsTo(models.administrador, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name:"usuarioadmin",
                        allowNull: false
                    }
                });

            }
        }
    });

    calificacion.removeAttribute('id');
    return calificacion;
};
