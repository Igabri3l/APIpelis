const helpers = require('../../helpers/utils')
const validate = require('../../helpers/validationSchema')
const Movies = require('../../models/Movies')
const Characters = require('../../models/Characters')
const Genders = require('../../models/Genders')

const { validateMovieDetails, validateMovieQuery } = validate
const { errorResponse, addCharacter, addGender, titleAndGenreFilter } = helpers

class moviesController {
  static async getAllMovies (req, res) {
    try {
      if (req.query.title || req.query.gender) {
        const { error } = validateMovieQuery(req.query)
        if (error) {
          const errorField = error.details[0].context.key
          const errorMessage = error.details[0].message
          return errorResponse(res, 400, 'USR_01', errorMessage, errorField)
        }
        let movie
        if (req.query.gender && req.query.title) {
          movie = await titleAndGenreFilter({ name: req.query.gender }, { title: req.query.title }, req.query.order)
        } else if (req.query.title) {
          movie = await titleAndGenreFilter({}, { title: req.query.title }, req.query.order)
        } else {
          movie = await titleAndGenreFilter({ name: req.query.gender }, {}, req.query.order)
        }
        return res.status(200).json(movie)
      }
      if (req.query.order) {
        const movie = await titleAndGenreFilter({}, {}, req.query.order)
        return res.status(200).json(movie)
      }
      const movie = await Movies.findAll({ attributes: ['image', 'title', 'create'] })
      return res.status(200).json(movie)
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  static async createMovie (req, res) {
    const { image, title, qualification, create, characterData, genderData } = req.body
    try {
      const { error } = validateMovieDetails(req.body)
      if (error) {
        const errorField = error.details[0].context.key
        const errorMessage = error.details[0].message
        return errorResponse(res, 400, 'USR_01', errorMessage, errorField)
      }
      const existingMovie = await Movies.findByTitle(title)
      if (existingMovie) return errorResponse(res, 409, 'USR_04', 'The movie already exists.', 'movie')
      const movie = await Movies.create({
        image,
        title,
        qualification,
        create
      })
      await addGender(movie, genderData)
      await addCharacter(movie, characterData)
      await movie.reload()
      return res.status(200).json(movie)
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  static async getMovie (req, res) {
    try {
      const movie = await Movies.findOne({
        include: [
          {
            model: Characters,
            attributes: ['image', 'name', 'age', 'weigth', 'history']
          },
          {
            model: Genders,
            attributes: ['image', 'name', 'id']
          }
        ],
        attributes: ['image', 'title', 'qualification', 'create'],
        where: { id: req.params.id }
      })
      return res.status(200).json(movie)
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  static async updateMovie (req, res) {
    const { image, title, qualification, create, characterData, genderData } = req.body
    try {
      const { error } = validateMovieDetails(req.body)
      if (error) {
        const errorField = error.details[0].context.key
        const errorMessage = error.details[0].message
        return errorResponse(res, 400, 'USR_01', errorMessage, errorField)
      }
      if (characterData) return errorResponse(res, 409, 'USR_04', 'to update characterData must be false', 'characterData')
      const existingTitle = await Movies.findByTitle(title)
      if (existingTitle) return errorResponse(res, 409, 'USR_04', 'The movie already exists.', 'movie')
      const movie = await Movies.update({
        image,
        title,
        qualification,
        create
      }, {
        where: {
          id: req.params.id
        }
      })
      await addGender(movie, genderData)
      return res.status(200).json(movie)
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  static async deleteMovie (req, res) {
    try {
      const movie = await Movies.destroy({
        where: {
          id: req.params.id
        }
      })
      return res.status(200).json(movie)
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}

module.exports = moviesController
