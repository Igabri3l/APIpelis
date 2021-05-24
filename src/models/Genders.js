const { Model, DataTypes } = require('sequelize')
const sequelize = require('../database.js')

class Genders extends Model {}

Genders.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El campo no puede ser nulo'
      },
      isAlpha: {
        args: true,
        msg: 'El nombre solo puede contener letras'
      },
      len: {
        args: [3, 30],
        msg: 'El nombre tiene que ser entre 3 y 30 caracteres'
      }
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'genders',
  timestamps: false
})
Genders.findByName = (name) => {
  const gender = Genders.findOne({
    where: { name }
  })
  return gender
}

module.exports = Genders
