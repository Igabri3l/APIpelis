const { Router } = require('express')
const moviesRouter = Router()

const moviesController = require('../controllers/moviesController')

moviesRouter.get('/', moviesController.getAllMovies)
moviesRouter.post('/', moviesController.createMovie)
moviesRouter.get('/:id', moviesController.getMovie)
moviesRouter.patch('/:id', moviesController.updateMovie)
moviesRouter.delete('/:id', moviesController.deleteMovie)

module.exports = moviesRouter
