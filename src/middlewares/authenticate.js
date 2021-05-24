const jwt = require('jsonwebtoken')
const { errorResponse } = require('../helpers/utils.js')
const { JWT_KEY } = require('../config.js')

// check and authenticate request token
const validateToken = (req, res, next) => {
  const token = req.headers['user-key']
  if (!token) {
    return errorResponse(res, 401, 'AUT_01', 'Authorization code is empty', 'USER_KEY')
  }
  if (token.split(' ')[0] !== 'Bearer') {
    return errorResponse(res, 401, 'AUT_02', 'The userkey is invalid', 'USER_KEY')
  }
  const accessToken = token.split(' ')[1]
  jwt.verify(accessToken, JWT_KEY, (err, decoded) => {
    if (err) {
      return errorResponse(res, 401, 'AUT_02', 'The userkey is invalid', 'USER_KEY')
    }
    req.user = decoded
    next()
  })
}
module.exports = validateToken
