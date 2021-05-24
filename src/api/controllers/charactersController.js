const helpers = require('../../helpers/utils')
const validate = require('../../helpers/validationSchema')
const Characters = require('../../models/Characters')
const Movies = require('../../models/Movies')
const Genders = require('../../models/Genders')

const { validateCharacterDetails, validateCharacterQuery } = validate
const { errorResponse, addMovie } = helpers

class characterController {
  static async getAllCharacter (req, res) {
    try {
      if (req.query.name || req.query.age || req.query.movie) {
        const { error } = validateCharacterQuery(req.query)
        if (error) {
          const errorField = error.details[0].context.key
          const errorMessage = error.details[0].message
          return errorResponse(res, 400, 'USR_01', errorMessage, errorField)
        }
        const query = Object.assign({}, req.query)
        delete query.movie

        if (!req.query.movie) {
          const character = await Characters.findAll({
            attributes: ['image', 'name'],
            where: query
          })
          return res.status(200).json(character)
        } else {
          const character = await Characters.findAll({
            include: [{
              model: Movies,
              attributes: [],
              where: { title: req.query.movie }
            }],
            attributes: ['image', 'name'],
            where: query
          })
          return res.status(200).json(character)
        }
      }
      const character = await Characters.findAll({ attributes: ['image', 'name'] })
      return res.status(200).json(character)
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  static async createCharacter (req, res) {
    const { image, name, age, weigth, history, movieData } = req.body
    try {
      const { error } = validateCharacterDetails(req.body)
      if (error) {
        const errorField = error.details[0].context.key
        const errorMessage = error.details[0].message
        return errorResponse(res, 400, 'USR_01', errorMessage, errorField)
      }
      const existingCharacter = await Characters.findByName(name)
      if (existingCharacter) return errorResponse(res, 409, 'USR_04', 'The character already exists.', 'character')
      const character = await Characters.create({
        image,
        name,
        age,
        weigth,
        history
      })
      if (!movieData) {
        return res.status(200).json(character)
      }
      const [movie] = await addMovie(character, movieData)
      character.dataValues.movie = movie
      return res.status(200).json(character)
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  static async getCharacter (req, res) {
    try {
      const character = await Characters.findOne({
        include: [{
          model: Movies,
          attributes: ['title', 'image'],
          include: [{
            model: Genders,
            attributes: ['id', 'name', 'image']
          }]
        }],
        attributes: ['image', 'name', 'age', 'weigth', 'history'],
        where: { id: req.params.id }
      })
      return res.status(200).json(character)
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  static async updateCharacter (req, res) {
    const { image, name, age, weigth, history, movieData } = req.body
    try {
      const { error } = validateCharacterDetails(req.body)
      if (error) {
        const errorField = error.details[0].context.key
        const errorMessage = error.details[0].message
        return errorResponse(res, 400, 'USR_01', errorMessage, errorField)
      }
      if (movieData) return errorResponse(res, 409, 'USR_04', 'to update movieData must be false', 'movieData')
      const existingCharacter = await Characters.findByName(name)
      if (existingCharacter) return errorResponse(res, 409, 'USR_04', 'The character already exists.', 'character')
      await Characters.update({
        image,
        name,
        age,
        weigth,
        history
      }, {
        where: {
          id: req.params.id
        }
      })
      return res.status(200).json({ ok: true })
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  static async deleteCharacter (req, res) {
    try {
      await Characters.destroy({
        where: {
          id: req.params.id
        }
      })
      return res.status(200).json({ ok: true })
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}

module.exports = characterController
