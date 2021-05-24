/* eslint-env jest */
const supertest = require('supertest')
const { app, server } = require('../src/index.js')
const sequelize = require('../src/database.js')
const Movies = require('../src/models/Movies')
const Genders = require('../src/models/Genders')
const api = supertest(app)

let jwt = ''

const user = {
  username: 'user',
  password: 'root',
  email: 'movie@gmail.com'
}

const movie = {
  image: 'https://images-na.ssl-images-amazon.com/images/I/818AHjVfufL._SY445_.jpg',
  title: 'Big Hero 6',
  qualification: 10,
  create: '2010-10-10',
  characterData: false,
  genderData: {
    name: 'aventura',
    image: 'https://i2.wp.com/img1.wikia.nocookie.net/__cb20141011040004/disney/images/c/c8/BH6_Team_Transparent.png'
  }
}

const movie2 = {
  image: 'https://img.repelis.id/cover/alicia-en-el-pais-de-las-maravillas.jpg',
  title: 'alicia en el país de las maravillas',
  qualification: 10,
  create: '2010-10-10',
  characterData: false,
  genderData: {
    name: 'infantils',
    image: 'https://ep01.epimg.net/verne/imagenes/2015/08/24/articulo/1440417628_800425_1440424601_noticia_normal.jpg'
  }
}

beforeAll(async () => {
  await Movies.destroy({
    where: {}
  })
  jwt = await api.post('/auth/register').send(user)
})

describe('POST /movies', () => {
  test('should create a movie', async () => {
    const res = await api.post('/movies').send(movie).set('user-key', jwt.body.accessToken)
    expect(res.status).toBe(200)
  })
})

describe('GET /movies', () => {
  test('should show all movies', async () => {
    const res = await api.get('/movies').set('user-key', jwt.body.accessToken)
    expect(res.status).toBe(200)
  })
})

describe('GET /movies/:id', () => {
  test('should show one movie', async () => {
    const res = await api.get('/movies/1').set('user-key', jwt.body.accessToken)
    expect(res.status).toBe(200)
  })
})

describe('PATCH /movies/:id', () => {
  test('should update a movie', async () => {
    const res = await api.patch('/movies/1').send(movie2).set('user-key', jwt.body.accessToken)
    expect(res.status).toBe(200)
  })
})

describe('DELETE /movies/:id', () => {
  test('should delete a movie', async () => {
    const res = await api.delete('/characters/1').set('user-key', jwt.body.accessToken)
    expect(res.status).toBe(200)
  })
})

afterAll(async () => {
  await Movies.destroy({
    where: {}
  })
  await Genders.destroy({
    where: {}
  })
  server.close()
  await sequelize.close()
})
