const Joi = require('joi')

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(20).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: Joi.string().min(3).max(30).required()
})

const loginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: Joi.string().min(3).max(30).required()
})

const characterSchema = Joi.object({
  image: Joi.string().min(4).max(115).required(),
  name: Joi.string().min(3).max(30).required(),
  age: Joi.number().integer().min(0).max(100).required(),
  weigth: Joi.number().integer().min(0).max(300).required(),
  history: Joi.string().min(10).max(200).required(),
  movieData: Joi.alternatives().try(
    Joi.array().items(
      Joi.object({
        image: Joi.string().min(3).max(115).required(),
        title: Joi.string().min(3).max(30).required(),
        qualification: Joi.number().integer().min(0).max(100).required(),
        create: Joi.date().required(),
        gender: Joi.alternatives().try(
          Joi.object({
            name: Joi.string().min(3).max(30).required(),
            image: Joi.string().min(3).max(115).required()
          }),
          Joi.boolean().valid(false)
        ).required()
      })
    ),
    Joi.boolean().valid(false)
  ).required()
})

const movieSchema = Joi.object({
  image: Joi.string().min(3).max(115).required(),
  title: Joi.string().min(3).max(60).required(),
  qualification: Joi.number().integer().min(0).max(100).required(),
  create: Joi.date().required(),
  characterData: Joi.alternatives().try(
    Joi.array().items(
      Joi.object({
        image: Joi.string().min(3).max(115).required(),
        name: Joi.string().min(3).max(30).required(),
        age: Joi.number().integer().min(0).max(100).required(),
        weigth: Joi.number().integer().min(0).max(300).required(),
        history: Joi.string().min(10).max(200).required()
      })
    ),
    Joi.boolean().valid(false)
  ).required(),
  genderData: Joi.alternatives().try(
    Joi.object({
      name: Joi.string().min(3).max(30).required(),
      image: Joi.string().min(3).max(115).required()
    }),
    Joi.boolean().valid(false)
  ).required()
})

const characterQuerySchema = Joi.object({
  name: Joi.string().min(3).max(30),
  age: Joi.number().integer().min(0).max(100),
  movie: Joi.string().min(3).max(30)
})

const MovieQuerySchema = Joi.object({
  title: Joi.string().min(3).max(30),
  gender: Joi.string().min(3).max(30),
  order: Joi.string().min(3).max(30)
})

module.exports = {
  validateRegisterDetails (user) {
    return registerSchema.validate(user)
  },
  validateLoginDetails (user) {
    return loginSchema.validate(user)
  },
  validateCharacterDetails (user) {
    return characterSchema.validate(user)
  },
  validateMovieDetails (user) {
    return movieSchema.validate(user)
  },
  validateCharacterQuery (query) {
    return characterQuerySchema.validate(query)
  },
  validateMovieQuery (query) {
    return MovieQuerySchema.validate(query)
  }
}
