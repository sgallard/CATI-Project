/**
 * Created by rodrigo on 10-09-16.
 */


"use strict";
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var llamada= sequelize.define("llamada", {
        estado: DataTypes.STRING
    }, {
        timestamps: true,
        updatedAt: false,
        classMethods: {
            associate: function(models) {
                llamada.belongsTo(models.encuestador, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name: "usuarioencuestador",
                        primaryKey: true,
                        allowNull: false
                    }
                });
                llamada.belongsTo(models.contacto, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name: "rutcontacto",
                        primaryKey: true,
                        allowNull: false
                    }
                });

            }
        }
    });

    return llamada;
};

