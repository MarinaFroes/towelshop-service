import request from 'supertest'

import { UserDocument } from '../../src/models/User'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

const nonExistingUserId = '5e57b77b5744fa0b461c7906'

const createUser = async (override?: Partial<UserDocument>) => {
  let user = {
    userName: 'fprefect',
    firstName: 'Ford',
    lastName: 'Prefect',
    email: 'fprefect@example.com',
    password: '123456',
    role: 'admin'
  }

  if (override) {
    user = { ...user, ...override }
  }

  return await request(app).post('/api/v1/users/signup').send(user)
}

describe('user controller', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create a user with token', async () => {
    const res = await createUser()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.token).not.toBe(undefined)
    expect(res.body.userName).toBe('fprefect')
  })

  it('should have required fields', async () => {
    const res = await request(app)
      .post('/api/v1/users/signup')
      .send({
        userName: 'fprefect',
        firstName: 'Ford',
        lastName: 'Prefect',
        // Required fields are missing
        // email: 'fprefect@example.com',
        // password: '424242',
      })
    expect(res.status).toBe(400)
  })

  it('should authenticate a user', async () => {
    let res = await createUser()
    
    res = await request(app)
      .post('/api/v1/users/login')
      .send({
        email: 'fprefect@example.com',
        password: '123456',
      })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.token).not.toBe(undefined)
    expect(res.body.email).toBe('fprefect@example.com')
  })

  it('should not authenticate a user with wrong credentials', async () => {
    let res = await createUser()
    
    res = await request(app)
      .post('/api/v1/users/login')
      .send({
        email: 'fprefect@example.com',
        password: 'ssdfsdfsf',
      })

    expect(res.status).toBe(404)
    expect(res.body).not.toHaveProperty('_id')
    expect(res.body.token).toBe(undefined)
    expect(res.body.email).toBe(undefined)
  })

  it('should not authenticate a banned user', async () => {
    const res = await createUser()
    const token = res.body.token

    let res1 = await createUser({
      userName: 'adent',
      firstName: 'Arthur',
      lastName: 'Dent',
      email: 'adent@example.com',
      password: '424242',
    })
    expect(res1.status).toBe(200)
    const userId = res1.body._id

    res1 = await request(app)
      .post(`/api/v1/users/${userId}/ban-user`)
      .set('Authorization', `Bearer ${token}`)
    expect(res1.status).toBe(200)

    res1 = await request(app)
      .get(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res1.body.isBanned).toBe(true)

    res1 = await request(app).post('/api/v1/users/login').send({
      email: 'adent@example.com',
      password: '424242',
    })

    expect(res1.status).toBe(403)
    expect(res1.body).not.toHaveProperty('_id')
    expect(res1.body.token).toBe(undefined)
    expect(res1.body.email).toBe(undefined)
  })

  it('should get back an existing user', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)

    const userId = res.body._id

    res = await request(app).get(`/api/v1/users/${userId}`).set('Authorization', `Bearer ${res.body.token}`)

    expect(res.status).toBe(200)
    expect(res.body._id).toEqual(userId)
  })

  it('should not get back a non-existing user', async () => {
    const res = await createUser()

    const res2 = await request(app)
      .get(`/api/v1/users/${nonExistingUserId}`)
      .set('Authorization', `Bearer ${res.body.token}`)
    
    expect(res2.status).toBe(404)
  })

  it('should get back all users', async () => {
    const res1 = await createUser({
      userName: 'adent',
      firstName: 'Arthur',
      lastName: 'Dent',
      email: 'adent@example.com',
      password: '424242',
    })
    const res2 = await createUser({
      userName: 'fprefect',
      firstName: 'Ford',
      lastName: 'Prefect',
      email: 'fprefect@example.com',
      password: '123456',
      role: 'admin'
    })
    
    const res3 = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${res2.body.token}`)
    expect(res3.status).toBe(200)
    expect(res3.body.length).toEqual(2)
    expect(res3.body[0]._id).toEqual(res1.body._id)
    expect(res3.body[1]._id).toEqual(res2.body._id)
  })

  it('should update an existing user', async () => {
    let res = await createUser()
    expect(res.status).toBe(200)

    const userId = res.body._id
    const update = {
      userName: 'ford.prefect',
      email: 'ford.prefect@example.com',
    }

    res = await request(app)
      .put(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${res.body.token}`)
      .send(update)

    expect(res.status).toBe(200)
    expect(res.body.userName).toEqual('ford.prefect')
    expect(res.body.email).toEqual('ford.prefect@example.com')
  })

  it('should delete an existing user', async () => {
    const res = await createUser()
    const token = res.body.token

    let res1 = await createUser({
      userName: 'adent',
      firstName: 'Arthur',
      lastName: 'Dent',
      email: 'adent@example.com',
      password: '424242',
    })
    expect(res1.status).toBe(200)
    const userId = res1.body._id

    res1 = await request(app)
      .delete(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res1.status).toEqual(204)

    res1 = await request(app)
      .get(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res1.status).toBe(404)
  })

  it('should ban an existing user', async () => {
    const res = await createUser()
    const token = res.body.token

    let res1 = await createUser({
      userName: 'adent',
      firstName: 'Arthur',
      lastName: 'Dent',
      email: 'adent@example.com',
      password: '424242',
    })
    expect(res1.status).toBe(200)
    const userId = res1.body._id

    res1 = await request(app)
      .post(`/api/v1/users/${userId}/ban-user`)
      .set('Authorization', `Bearer ${token}`)
    expect(res1.status).toBe(200)

    res1 = await request(app)
      .get(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res1.body.isBanned).toBe(true)
  })

  it('should unban an existing user', async () => {
    const res = await createUser()
    const token = res.body.token

    let res1 = await createUser({
      userName: 'adent',
      firstName: 'Arthur',
      lastName: 'Dent',
      email: 'adent@example.com',
      password: '424242',
    })
    expect(res1.status).toBe(200)
    const userId = res1.body._id

    res1 = await request(app)
      .post(`/api/v1/users/${userId}/unban-user`)
      .set('Authorization', `Bearer ${token}`)
    expect(res1.status).toBe(200)

    res1 = await request(app)
      .get(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res1.body.isBanned).toBe(false)
  })
})
