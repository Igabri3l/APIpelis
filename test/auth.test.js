/* eslint-env jest */
const supertest = require('supertest')
const { app, server } = require('../src/index.js')
const sequelize = require('../src/database.js')
const User = require('../src/models/Users')
const api = supertest(app)

const user = {
  username: 'user',
  password: 'root',
  email: 'user@gmail.com'
}

beforeAll(async () => {
  await User.destroy({
    truncate: true,
    cascade: false
  })
})

describe('POST /auth/register', () => {
  test('should register a user', async () => {
    const res = await api.post('/auth/register').send(user)
    expect(res.status).toBe(200)
    expect(res.body.user.username).toBe(user.username)
    expect(res.body.user.email).toBe(user.email)
    expect(res.body).toHaveProperty('accessToken')
    expect(res.body.expires_in).toBe('24h')
  })

  test('should return 409 if email exists', async () => {
    const res = await api.post('/auth/register').send(user)
    expect(res.status).toBe(409)
    expect(res.body.error.code).toBe('USR_04')
    expect(res.body.error.field).toBe('email')
    expect(res.body.error.message).toBe('The email already exists.')
  })
})

describe('POST /auth/login', () => {
  test('should successfully login a customer', async () => {
    delete user.username
    const res = await api.post('/auth/login').send(user)
    expect(res.status).toBe(200)
    expect(res.body.user.name).toBe(user.username)
    expect(res.body.user.email).toBe(user.email)
    expect(res.body).toHaveProperty('accessToken')
    expect(res.body.expires_in).toBe('24h')
  })

  test('should fail if email is wrong', async () => {
    const res = await api.post('/auth/login').send({
      email: 'wrong@gmail.com',
      password: user.password
    })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('USR_05')
    expect(res.body.error.field).toBe('email')
    expect(res.body.error.message).toBe('The email doesn\'t exist.')
  })

  test('should fail if password is wrong', async () => {
    const res = await api.post('/auth/login').send({
      email: user.email,
      password: 'wrong_password'
    })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('USR_02')
    expect(res.body.error.field).toBe('')
    expect(res.body.error.message).toBe('Email or Password is invalid.')
  })
})

afterAll(async () => {
  server.close()
  await sequelize.close()
})
