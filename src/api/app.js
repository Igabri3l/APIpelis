const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/authenticate')

// imports

const authRouter = require('./routes/auth')
const characterRouter = require('./routes/characters')
const moviesRouter = require('./routes/movies')
const genderRouter = require('./routes/gender')

router.use('/auth', authRouter)
router.use('/characters', authenticate, characterRouter)
router.use('/movies', authenticate, moviesRouter)
router.use('/genders', authenticate, genderRouter)

module.exports = router
