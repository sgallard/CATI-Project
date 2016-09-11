/**
 * Created by rodrigo on 10-09-16.
 */


"use strict";
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var proyecto_contacto= sequelize.define("proyecto_contacto", {
        estado: DataTypes.STRING
    }, {
        timestamps:false,
        classMethods: {
            associate: function(models) {
                proyecto_contacto.belongsTo(models.proyecto, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name: "idproyecto",
                        allowNull: false
                    }
                });

                proyecto_contacto.belongsTo(models.contacto, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name: 'rutcontacto',
                        allowNull: false
                    }
                });

            }
        }
    });

    proyecto_contacto.removeAttribute('id');
    return proyecto_contacto;
};
