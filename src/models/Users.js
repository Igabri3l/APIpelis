const { Model, DataTypes } = require('sequelize')
const sequelize = require('../database.js')

class User extends Model {}

User.init({
  username: {
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
        args: [3, 255],
        msg: 'El nombre tiene que ser entre 3 y 255 caracteres'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: {
        args: true,
        msg: 'El campo tiene que ser un correo valido'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'user',
  timestamps: false,
  scopes: {
    withoutPassword: {
      attributes: { exclude: ['password'] }
    }
  }
})
User.findByEmail = (email) => {
  const user = User.findOne({
    where: { email }
  })
  return user
}
module.exports = User
