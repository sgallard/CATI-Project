/**
 * Created by rodrigo on 10-09-16.
 */

"use strict";
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var pregunta= sequelize.define("pregunta",  {
        idpregunta:  {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        pregunta: DataTypes.STRING
    }, {
        timestamps:false,
        classMethods: {
            associate: function(models) {
                pregunta.belongsTo(models.encuesta, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name: 'idencuesta',
                        allowNull: false
                    }
                });

                pregunta.hasMany(models.respuesta, { foreignKey: {
                    name: 'idpregunta',
                    allowNull: false
                } });



            }
        }
    });

    return pregunta;
};
