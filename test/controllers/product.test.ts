import request from 'supertest'

import { ProductDocument } from '../../src/models/Product'
import { UserDocument } from '../../src/models/User'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

const nonExistingProductId = '5e57b77b5744fa0b461c7906'

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

describe('product controller', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create a product', async () => {
    const userRes = await createUser()
    const token = userRes.body.token

    const res = await createProduct(token)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.name).toBe('2-pack white towels')
  })

  it('should not create a product with wrong credentials', async () => {
    const userRes = await createUser({ 
      role: 'user'
    })
    const token = userRes.body.token

    let res = await createProduct(token)
    expect(res.status).toBe(403)

    const invalidToken = 'asdasdasasdasdasd'

    res = await createProduct(invalidToken)
    expect(res.status).toBe(401)
  })

  it('should not miss required fields', async () => {
    const userRes = await createUser()
    const token = userRes.body.token

    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        countInStock: 19,
        categories: [
            'accessory',
            'pack'
        ],
        name: '2-pack white towels',
        // Description field is required
        // description: 'Perfect towels for someone who really knows where their towels are.',
        variant: 'white',
        size: 'medium',
        price: 20,
        mediaUrl: 'https://res.cloudinary.com/dglvomnoi/image/upload/v1603111060/m8nrze7yezcjgrz4cqp2.jpg',
      })
    expect(res.status).toBe(400)
  })

  it('should get back an existing product', async () => {
    const userRes = await createUser()
    const token = userRes.body.token

    let res = await createProduct(token)
    expect(res.status).toBe(200)

    const productId = res.body._id
    res = await request(app)
      .get(`/api/v1/products/${productId}`)
    
    expect(res.status).toBe(200)
    expect(res.body._id).toEqual(productId)
  })

  it('should not get back a non-existing product', async () => {
    const res = await request(app)
      .get(`/api/v1/products/${nonExistingProductId}`)
    expect(res.status).toBe(404)
  })

  it('should get back all products', async () => {
    const userRes = await createUser()
    const token = userRes.body.token

    const res1 = await createProduct(token)
    const res2 = await createProduct(token)

    const res3 = await request(app)
      .get('/api/v1/products/all')

    expect(res3.body.length).toEqual(2)
    expect(res3.body[0]._id).toEqual(res1.body._id)
    expect(res3.body[1]._id).toEqual(res2.body._id)
  })

  it('should get back paginated products', async () => {
    const userRes = await createUser()
    const token = userRes.body.token

    const res1 = await createProduct(token)
    const res2 = await createProduct(token)
    const res3 = await createProduct(token)
    const res4 = await createProduct(token)

    const resPage1 = await request(app)
      .get('/api/v1/products')
    
    const resPage2 = await request(app)
      .get('/api/v1/products?page=2')
    
    // It should have 2 pages
    expect(resPage1.body.totalPages).toEqual(2)
    // It should have 3 products on the first page
    expect(resPage1.body.items.length).toEqual(3)
    // It should have 1 product on the second page
    expect(resPage2.body.items.length).toEqual(1)
    
    expect(resPage1.body.items[0]._id).toEqual(res1.body._id)
    expect(resPage1.body.items[1]._id).toEqual(res2.body._id)
    expect(resPage1.body.items[2]._id).toEqual(res3.body._id)
    expect(resPage2.body.items[0]._id).toEqual(res4.body._id)
  })

  it('should get back filtered products', async () => {
    const userRes = await createUser()
    const token = userRes.body.token

    await createProduct(token, {
      categories: [
        'utility',
        'pack'
      ],
    })
    const res = await createProduct(token, {
      categories: [
        'utility',
        'single'
      ],
    })

    const resFiltered = await request(app)
      .get('/api/v1/products?category=single')
    
    expect(resFiltered.body.totalPages).toEqual(1)
    expect(resFiltered.body.items.length).toEqual(1)
    expect(resFiltered.body.items[0]._id).toEqual(res.body._id)
  })

  it('should update an existing product', async () => {
    const userRes = await createUser()
    const token = userRes.body.token

    let res = await createProduct(token)
    expect(res.status).toBe(200)
    
    const productId = res.body._id
    const update = {
      name: '2-pack white cotton towels',
    }

    res = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(update)

    expect(res.status).toEqual(200)
    expect(res.body.name).toEqual('2-pack white cotton towels')
  })

  it('should delete an existing product', async () => {
    const userRes = await createUser()
    const token = userRes.body.token

    let res = await createProduct(token)
    expect(res.status).toBe(200)
    const productId = res.body._id

    res = await request(app)
      .delete(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toEqual(204)

    res = await request(app)
      .get(`/api/v1/products/${productId}`)
    expect(res.status).toBe(404)
  })
})
