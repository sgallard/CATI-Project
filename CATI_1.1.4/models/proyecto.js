/**
 * Created by rodrigo on 10-09-16.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var proyecto = sequelize.define("proyecto", {
        idproyecto:  {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        nombre: DataTypes.STRING
    }, {
        timestamps:false,
        classMethods: {
            associate: function(models) {
                proyecto.hasMany(models.encuesta, { foreignKey: {
                    name: 'idproyecto',
                    allowNull: false
                } });
                proyecto.hasMany(models.proyecto_contacto, { foreignKey: {
                    name: 'idproyecto',
                    allowNull: false
                } })
            }
        }
    });
    return proyecto;
};
