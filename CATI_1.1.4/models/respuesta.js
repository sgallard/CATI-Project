/**
 * Created by rodrigo on 10-09-16.
 */
"use strict";
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var respuesta = sequelize.define("respuesta", {
        idrespuesta:  {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },

        respuesta: DataTypes.STRING
    }, {
        timestamps:false,
        classMethods: {
            associate: function(models) {
                respuesta.belongsTo(models.pregunta, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name: 'idpregunta',
                        allowNull: false
                    }
                });
                respuesta.belongsTo(models.contacto, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name: 'rutcontacto',
                        allowNull: false
                    }
                });


            }
        }
    });

    return respuesta;
};
