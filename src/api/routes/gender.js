const { Router } = require('express')
const Genders = require('../../models/Genders')
const genderRouter = Router()

genderRouter.get('/', async (req, res) => {
  try {
    const gender = await Genders.findAll({ attributes: ['id', 'image', 'name'] })
    return res.status(200).json(gender)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = genderRouter
