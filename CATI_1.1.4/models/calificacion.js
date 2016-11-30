
"use strict";
var Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    var calificacion;
    calificacion = sequelize.define("calificacion", {

        nota: DataTypes.INTEGER,
        comentario: DataTypes.STRING,
        fecha:  {
            type: DataTypes.STRING,
            primaryKey: true
        },
    }, {timestamps:false,
        updatedAt: false,
        classMethods: {
            associate: function (models) {
                calificacion.belongsTo(models.encuestador, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name:"usuarioencuestador",
                        primaryKey: true,
                        allowNull: false
                    }
                });

            }
        }
    });

    calificacion.removeAttribute('id');
    return calificacion;
};
