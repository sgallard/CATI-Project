
"use strict";
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var encuesta= sequelize.define("encuesta", {
        idencuesta:  {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        url: DataTypes.STRING
    }, {
        timestamps:false,
        classMethods: {
            associate: function(models) {
                encuesta.belongsTo(models.proyecto, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name:"idproyecto",
                        allowNull: false
                    }
                });
            }
        }
    });

    return encuesta;
};
