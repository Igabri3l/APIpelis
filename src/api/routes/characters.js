const { Router } = require('express')
const characterRouter = Router()

const characterController = require('../controllers/charactersController')

characterRouter.get('/', characterController.getAllCharacter)
characterRouter.post('/', characterController.createCharacter)
characterRouter.get('/:id', characterController.getCharacter)
characterRouter.patch('/:id', characterController.updateCharacter)
characterRouter.delete('/:id', characterController.deleteCharacter)

module.exports = characterRouter
