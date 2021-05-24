require('dotenv').config()
let USER, PASSWORD, DATABASE, HOST, JWT_KEY, SENDGRID_API_KEY

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing') {
  USER = 'postgres'
  PASSWORD = 'gabriel'
  DATABASE = 'empresa'
  HOST = 'localhost'
  JWT_KEY = 'password1234'
  SENDGRID_API_KEY = ''
} else {
  USER = process.env.USER
  PASSWORD = process.env.PASSWORD
  DATABASE = process.env.DATABASE
  HOST = process.env.HOST
  JWT_KEY = process.env.JWT_KEY
  SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
}

module.exports = {
  USER,
  PASSWORD,
  DATABASE,
  HOST,
  JWT_KEY,
  SENDGRID_API_KEY
}
