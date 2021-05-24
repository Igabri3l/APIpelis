const { Model, DataTypes } = require('sequelize')
const sequelize = require('../database.js')

class Characters extends Model {}

Characters.init({
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El campo no puede ser nulo'
      },
      len: {
        args: [3, 255],
        msg: 'El nombre tiene que ser entre 3 y 255 caracteres'
      }
    }
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  weigth: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  history: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'characters',
  timestamps: false
})
Characters.findByName = (name) => {
  const character = Characters.findOne({
    where: { name }
  })
  return character
}
module.exports = Characters
