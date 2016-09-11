/**
 * Created by rodrigo on 10-09-16.
 */


"use strict";
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var llamada= sequelize.define("llamada", {
        duracion: DataTypes.STRING,
        id_grabacion: DataTypes.INTEGER,
        estado: DataTypes.STRING

    }, {

        timestamps: true,
        updatedAt: false,
        classMethods: {
            associate: function(models) {
                llamada.hasMany(models.calificacion,  { foreignKey: {
                    name: 'id',
                    allowNull: false
                } });
                llamada.belongsTo(models.encuestador, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name: "usuarioencuestador",
                        allowNull: false
                    }
                });

                llamada.belongsTo(models.contacto, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name: "rutcontacto",
                        allowNull: false
                    }
                });

            }
        }
    });

    return llamada;
};

