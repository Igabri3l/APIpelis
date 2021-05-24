const Characters = require('./models/Characters')
const Movies = require('./models/Movies')
const Genders = require('./models/Genders')

Characters.belongsToMany(Movies, { through: 'user_band' })
Movies.belongsToMany(Characters, { through: 'user_band' })

Genders.hasMany(Movies)
Movies.belongsTo(Genders)
