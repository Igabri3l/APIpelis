const { Model, DataTypes } = require('sequelize')
const sequelize = require('../database.js')

class Movies extends Model {}

Movies.init({
  image: {
    type: DataTypes.STRING
  },
  title: {
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
  qualification: {
    type: DataTypes.INTEGER
  },
  create: {
    type: DataTypes.DATEONLY
  }
}, {
  sequelize,
  modelName: 'movies',
  timestamps: false
})
Movies.findByTitle = (title) => {
  const movie = Movies.findOne({
    where: { title }
  })
  return movie
}

module.exports = Movies
