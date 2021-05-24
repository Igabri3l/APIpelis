const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Movies = require('../models/Movies')
const Characters = require('../models/Characters')
const Genders = require('../models/Genders')
const sgMail = require('@sendgrid/mail')

const { JWT_KEY, SENDGRID_API_KEY } = require('../config.js')

async function orden (array, type) {
  array = await array.sort((a, b) => {
    a = a.dataValues.create.split('-')
    b = b.dataValues.create.split('-')
    for (let idx = 0; idx < a.length; idx++) {
      a[idx] = parseInt(a[idx])
      b[idx] = parseInt(b[idx])
    }
    a = new Date(a[0], a[1] - 1, a[2]).getTime()
    b = new Date(b[0], b[1] - 1, b[2]).getTime()
    if (type === 'DES') {
      if (a < b) {
        return 1
      } else if (a > b) {
        return -1
      }
      return 0
    } else {
      if (a < b) {
        return -1
      } else if (a > b) {
        return 1
      }
      return 0
    }
  })
  return array
}

module.exports = {
  async hashPassword (password) {
    const hash = await bcrypt.hash(password, 10)
    return hash
  },

  async comparePasswords (password, userPassword) {
    const match = await bcrypt.compare(password, userPassword)
    return match
  },

  async addMovie (character, movieData) {
    const movie = []
    for (let idx = 0; idx < movieData.length; idx++) {
      if (movieData[idx].gender) {
        const [gender] = await Genders.findOrCreate({ where: movieData[idx].gender })
        delete movieData[idx].gender
        const [res] = await Movies.findOrCreate({ where: movieData[idx] })
        movie.push(res)
        gender.addMovies(res)
      } else {
        delete movieData[idx].gender
        const [res] = await Movies.findOrCreate({ where: movieData[idx] })
        movie.push(res)
      }
    }
    character = await character.setMovies(movie)
    return character
  },

  async addCharacter (movie, characterData) {
    if (characterData) {
      const characters = []
      for (let idx = 0; idx < characterData.length; idx++) {
        const [character] = await Characters.findOrCreate({ where: characterData[idx] })
        characters.push(character)
      }
      movie = await movie.setCharacters(characters)
    }
    return movie
  },

  async addGender (movie, genderData) {
    if (genderData) {
      const [gender] = await Genders.findOrCreate({ where: genderData })
      await gender.addMovies(movie)
    }
    return movie
  },

  createToken (user) {
    const { username, email } = user
    return jwt.sign({ username, email }, JWT_KEY, { expiresIn: 86400 })
  },

  errorResponse (res, status, code, message, field) {
    return res.status(status).json({
      error: {
        status,
        code,
        message,
        field: field || ''
      }
    })
  },

  async titleAndGenreFilter (genre, title, order) {
    const movie = await Movies.findAll({
      include: [{
        model: Genders,
        attributes: [],
        where: genre
      }],
      attributes: ['image', 'title', 'create'],
      where: title
    })
    let res
    switch (order) {
      case 'ASC':
        res = orden(movie, order)
        break
      case 'DES':
        res = orden(movie, order)
        break
      default:
        res = movie
        break
    }
    return res
  },
  async sendEmail (email) {
    sgMail.setApiKey(SENDGRID_API_KEY)

    const msg = {
      to: 'ivangabriel.2048@gmail.com', // Change to your recipient
      from: email, // Change to your verified sender
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>'
    }

    await sgMail.send(msg)
      .then((response) => {
        console.log(response[0].statusCode)
        console.log(response[0].headers)
      })
      .catch((error) => {
        console.error(error)
      })
  }
}
