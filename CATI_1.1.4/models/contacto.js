/**
 * Created by rodrigo on 10-09-16.
 */

"use strict";
module.exports = function(sequelize, DataTypes) {
    var contacto = sequelize.define("contacto", {
        rutcontacto:  {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        nombre: DataTypes.STRING,
        direccion: DataTypes.STRING,
        numero: DataTypes.INTEGER
    }, {
        timestamps:false,
        classMethods: {
            associate: function(models) {
                contacto.hasMany(models.respuesta,{ foreignKey: {
                    name: 'rutcontacto',
                    allowNull: false
                } });
                contacto.hasMany(models.proyecto_contacto,{ foreignKey: {
                    name: 'rutcontacto',
                    allowNull: false
                } });
                contacto.hasMany(models.llamada,{ foreignKey: {
                    name: 'rutcontacto',
                    allowNull: false
                } });
            }
        }
    });
    return contacto;
};
