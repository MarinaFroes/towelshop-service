import request from 'supertest'

import { ProductDocument } from '../../src/models/Product'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

const nonExistingProductId = '5e57b77b5744fa0b461c7906'

async function createProduct(override?: Partial<ProductDocument>) {
  let product = {
    name: 'Simple Day Dress',
    description: 'Medium length dress with no pattern',
    categories: [
      'Dresses', 'Casual Dresses'
    ],
    price: 20.00,
    variant: 'blue',
    size: 'medium',
    mediaUrl: 'someUrl'
  }

  if (override) {
    product = { ...product, ...override }
  }

  return await request(app)
    .post('/api/v1/products')
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
    const res = await createProduct()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.name).toBe('Simple Day Dress')
  })

  it('should not miss required fields', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .send({
        name: 'Simple Day Dress',
        categories: [
          'Dresses', 'Casual Dresses'
        ],
        // Required fields are missing
        // description: 'Medium length dress with no pattern',
        // price: 20.00,
        variant: 'blue',
        size: 'medium',
        mediaUrl: 'someUrl'
      })
    expect(res.status).toBe(400)
  })

  it('should get back an existing product', async () => {
    let res = await createProduct()
    expect(res.status).toBe(200)

    const productId = res.body._id
    res = await request(app)
      .get(`/api/v1/products/${productId}`)

    expect(res.body._id).toEqual(productId)
  })

  it('should not get back a non-existing product', async () => {
    const res = await request(app)
      .get(`/api/v1/products/${nonExistingProductId}`)
    expect(res.status).toBe(404)
  })

  it('should get back all products', async () => {
    const res1 = await createProduct({
      name: 'Day Dress',
      price: 30.00,
      description: 'Long length cotton dress',
      mediaUrl: 'someUrl1'
    })
    const res2 = await createProduct({
      name: 'Simple Day Dress',
      price: 20.00,
      description: 'Medium length cotton dress',
      mediaUrl: 'someUrl2'
    })

    const res3 = await request(app)
      .get('/api/v1/products')

    expect(res3.body.length).toEqual(2)
    expect(res3.body[0]._id).toEqual(res1.body._id)
    expect(res3.body[1]._id).toEqual(res2.body._id)
  })

  it('should update an existing product', async () => {
    let res = await createProduct()
    expect(res.status).toBe(200)
    
    const productId = res.body._id
    const update = {
      name: 'Updated Day Dress',
      mediaUrl: 'someUpdatedUrl'
    }

    res = await request(app)
      .put(`/api/v1/products/${productId}`)
      .send(update)

    expect(res.status).toEqual(200)
    expect(res.body.name).toEqual('Updated Day Dress')
    expect(res.body.mediaUrl).toEqual('someUpdatedUrl')
  })

  it('should delete an existing product', async () => {
    let res = await createProduct()
    expect(res.status).toBe(200)
    const productId = res.body._id

    res = await request(app)
      .delete(`/api/v1/products/${productId}`)

    expect(res.status).toEqual(204)

    res = await request(app)
      .get(`/api/v1/products/${productId}`)
    expect(res.status).toBe(404)
  })
})
