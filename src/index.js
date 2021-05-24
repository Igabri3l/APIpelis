const express = require('express')
const app = express()
const sequelize = require('./database.js')
require('./asociations.js')

const cors = require('cors')

// settings
app.set('port', process.env.PORT || 3000)

// midleward
app.use(cors())
app.use(express.json())

app.use('/', require('./api/app'))

const server = app.listen(app.get('port'), function () {
  console.log(`La app ha arrancado en http://localhost:${app.get('port')}`)
  sequelize.sync({ force: false }).then(() => {
    console.log('Nos hemos conectado a la base de datos')
  }).catch(error => {
    console.log('Se ha producido un error', error)
  })
})
module.exports = { app, server }
