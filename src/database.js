const { Sequelize } = require('sequelize')
const { DATABASE, USER, PASSWORD, HOST } = require('./config.js')
const URI = {
  DATABASE,
  USER,
  PASSWORD,
  OPTIONS: {
    host: HOST,
    dialect: 'postgres'
  }
}
if (process.env.NODE_ENV === 'production') {
  URI.OPTIONS.dialectOptions = {
    ssl: {
      rejectUnauthorized: false
    }
  }
}

const sequelize = new Sequelize(URI.DATABASE, URI.USER, URI.PASSWORD, URI.OPTIONS)

module.exports = sequelize
