import request from 'supertest'

import { UserDocument } from '../../src/models/User'
import { ProductDocument } from '../../src/models/Product'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

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

const createProduct = async (token: string, override?: Partial<ProductDocument>) => {
  let product = {
    countInStock: 19,
    categories: [
        'accessory',
        'pack'
    ],
    name: '2-pack white towels',
    description: 'Perfect towels for someone who really knows where their towels are. ',
    variant: 'white',
    size: 'medium',
    price: 20,
    mediaUrl: 'https://res.cloudinary.com/dglvomnoi/image/upload/v1603111060/m8nrze7yezcjgrz4cqp2.jpg',
  }

  if (override) {
    product = { ...product, ...override }
  }

  return await request(app)
    .post('/api/v1/products')
    .set('Authorization', `Bearer ${token}`)
    .send(product)
}

describe('cart controller', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should get cart for a user', async () => {
    const userRes = await createUser()
    const token = userRes.body.token

    const res = await request(app)
      .get('/api/v1/cart')
      .set('Authorization', `Bearer ${token}`)
    
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.user).toEqual(userRes.body._id)
  })

  it('should not get cart with wrong credentials', async () => {
    const invalidToken = 'dasdasdasdadadsd'

    const res = await request(app)
      .get('/api/v1/cart')
      .set('Authorization', `Bearer ${invalidToken}`)
    
    expect(res.status).toBe(401)
  })

  it('should get all carts', async () => {
    const userRes = await createUser()
    const token = userRes.body.token  

    const userRes1 = await createUser({
      email: 'user@example.com'
    })
    const userRes2 = await createUser({
      email: 'user1@example.com'
    })

    const res = await request(app)
      .get('/api/v1/cart/all')
      .set('Authorization', `Bearer ${token}`)
    
    expect(res.status).toBe(200)
    expect(res.body.length).toEqual(3)
    expect(res.body[0].user).toEqual(userRes.body._id)
    expect(res.body[1].user).toEqual(userRes1.body._id)
    expect(res.body[2].user).toEqual(userRes2.body._id)
  })

  it('should add a product to cart', async () => {
    const userRes = await createUser()
    const token = userRes.body.token  

    const product = await createProduct(token)
    const productId: string = product.body._id

    let res = await request(app)
      .put('/api/v1/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, qty: 3 })

    res = await request(app)
      .put('/api/v1/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, qty: 2 })
    
    expect(res.body.products.length).toEqual(1)
    expect(res.body.products[0].product._id).toEqual(productId)
    expect(res.body.products[0].quantity).toEqual(5)
  })

  it('should remove product from cart', async () => {
    const userRes = await createUser()
    const token = userRes.body.token  

    const product = await createProduct(token)
    const productId: string = product.body._id

    let res = await request(app)
      .put('/api/v1/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, qty: 3 })
    
    expect(res.body.products.length).toEqual(1)

    res = await request(app)
      .delete('/api/v1/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId })
    
    expect(res.body.products.length).toEqual(0)
  })

})
