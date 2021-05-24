/* eslint-env jest */
const supertest = require('supertest')
const { app, server } = require('../src/index.js')
const sequelize = require('../src/database.js')
const Characters = require('../src/models/Characters')
const api = supertest(app)

let jwt = ''

const user = {
  username: 'user',
  password: 'root',
  email: 'character@gmail.com'
}

const character = {
  image: 'https://www.bolsamania.com/cine/wp-content/uploads/2019/04/16-24-600x398.jpg',
  name: 'aladdin',
  age: 24,
  weigth: 60,
  history: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper ipsum pretium, tempor justo in, dapibus ante. Nunc sit amet velit felis. Aliquam ac elementum lorem. Mauris faucibus',
  movieData: false
}

const character2 = {
  image: 'https://img.vixdata.io/pd/webp-large/es/sites/default/files/t/the-lion-king-mufasa.jpg',
  name: 'mufasa',
  age: 35,
  weigth: 70,
  history: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis semper ipsum pretium, tempor justo in, dapibus ante. Nunc sit amet velit felis. Aliquam ac elementum lorem. Mauris faucibus',
  movieData: false
}

beforeAll(async () => {
  await Characters.destroy({
    where: {}
  })
  jwt = await api.post('/auth/register').send(user)
})

describe('POST /characters', () => {
  test('should create a character', async () => {
    const res = await api.post('/characters').send(character).set('user-key', jwt.body.accessToken)
    expect(res.status).toBe(200)
  })
})

describe('GET /characters', () => {
  test('should show all character', async () => {
    const res = await api.get('/characters').set('user-key', jwt.body.accessToken)
    expect(res.status).toBe(200)
  })
})

describe('GET /characters/:id', () => {
  test('should show one character', async () => {
    const res = await api.get('/characters').set('user-key', jwt.body.accessToken)
    expect(res.status).toBe(200)
  })
})

describe('PATCH /characters/:id', () => {
  test('should update a character', async () => {
    const res = await api.patch('/characters/1').send(character2).set('user-key', jwt.body.accessToken)
    expect(res.status).toBe(200)
  })
})

describe('DELETE /characters/:id', () => {
  test('should delete a character', async () => {
    const res = await api.delete('/characters/1').send(character2).set('user-key', jwt.body.accessToken)
    expect(res.status).toBe(200)
  })
})

afterAll(async () => {
  await Characters.destroy({
    where: {}
  })
  server.close()
  await sequelize.close()
})
