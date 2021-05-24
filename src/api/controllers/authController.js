const helpers = require('../../helpers/utils')
const validate = require('../../helpers/validationSchema')
const User = require('../../models/Users')

const { validateRegisterDetails, validateLoginDetails } = validate

const {
  hashPassword,
  createToken,
  errorResponse,
  comparePasswords
  // sendEmail
} = helpers

class authController {
  static async register (req, res) {
    const { email, username, password } = req.body
    try {
      const { error } = validateRegisterDetails(req.body)
      if (error) {
        const errorField = error.details[0].context.key
        const errorMessage = error.details[0].message
        return errorResponse(res, 400, 'USR_01', errorMessage, errorField)
      }
      const existingUser = await User.findByEmail(email)
      if (existingUser) return errorResponse(res, 409, 'USR_04', 'The email already exists.', 'email')
      const hashedPassword = await hashPassword(password)
      const user = await User.create({
        username,
        email,
        password: hashedPassword
      })
      await user.reload()
      delete user.dataValues.password
      const token = createToken(user)
      // sendEmail(user.email)
      return res.status(200).json({
        accessToken: `Bearer ${token}`,
        user,
        expires_in: '24h'
      })
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  static async login (req, res) {
    const { email, password } = req.body
    try {
      const { error } = validateLoginDetails(req.body)
      if (error) {
        const errorField = error.details[0].context.key
        const errorMessage = error.details[0].message
        return errorResponse(res, 400, 'USR_01', errorMessage, errorField)
      }
      const existingUser = await User.scope('withoutPassword').findByEmail(email)
      if (!existingUser) return errorResponse(res, 400, 'USR_05', "The email doesn't exist.", 'email')
      const match = await comparePasswords(password, existingUser.dataValues.password)
      if (match) {
        const user = existingUser.dataValues
        delete existingUser.dataValues.password
        const token = await createToken(user)
        res.status(200).json({
          accessToken: `Bearer ${token}`,
          user,
          expires_in: '24h'
        })
      } else {
        return errorResponse(res, 400, 'USR_02', 'Email or Password is invalid.')
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}

module.exports = authController
