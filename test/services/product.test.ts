import Product from '../../src/models/Product'
import ProductService from '../../src/services/product'
import * as dbHelper from '../db-helper'

const nonExistingProductId = '5e57b77b5744fa0b461c7906'

const createProduct = async () => {
  const product = new Product({
    countInStock: 19,
    categories: [
        'accessory',
        'pack'
    ],
    name: '2-pack white towels',
    description: 'Perfect towels for someone who really knows where their towels are.',
    variant: 'white',
    size: 'medium',
    price: 20,
    mediaUrl: 'https://res.cloudinary.com/dglvomnoi/image/upload/v1603111060/m8nrze7yezcjgrz4cqp2.jpg',
  })
  return await ProductService.create(product)
}

describe('product service', () => {
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
    const product = await createProduct()
    expect(product).toHaveProperty('_id')
    expect(product).toHaveProperty('name', '2-pack white towels')
    expect(product).toHaveProperty('price', 20)
    expect(product).toHaveProperty('variant', 'white')
    expect(product).toHaveProperty('size', 'medium')
    expect(product).toHaveProperty('countInStock', 19)
    expect(product).toHaveProperty('description', 'Perfect towels for someone who really knows where their towels are.')
    expect(product).toHaveProperty('mediaUrl', 'https://res.cloudinary.com/dglvomnoi/image/upload/v1603111060/m8nrze7yezcjgrz4cqp2.jpg')
  })

  it('should get all products', async () => {
    const product1 = await createProduct()
    const product2 = await createProduct()
    const product3 = await createProduct()

    const productsList = await ProductService.findAll()
    expect(productsList.length).toEqual(3)
    expect(productsList[0]._id).toEqual(product1._id)
    expect(productsList[1]._id).toEqual(product2._id)
    expect(productsList[2]._id).toEqual(product3._id)
  })

  it('should get all paginated products', async () => {
    const product1 = await createProduct()
    const product2 = await createProduct()
    const product3 = await createProduct()
    const product4 = await createProduct()

    let productsList = await ProductService.findPaginated({})
    expect(productsList.items.length).toEqual(3)
    expect(productsList.totalPages).toEqual(2)
    expect(productsList.items[0]._id).toEqual(product1._id)
    expect(productsList.items[1]._id).toEqual(product2._id)
    expect(productsList.items[2]._id).toEqual(product3._id)

    productsList = await ProductService.findPaginated({ page: '2' })
    expect(productsList.items[0]._id).toEqual(product4._id)
  })

  it('should get a product with id', async () => {
    const product = await createProduct()
    const found = await ProductService.findById(product._id)
    expect(found?.name).toEqual(product.name)
    expect(found?._id).toEqual(product._id)
  })

  it('should not get a non-existing product', async () => {
    const product = await ProductService.findById(nonExistingProductId)
    expect(product).toBe(null)
  })

  it('should update an existing product', async () => {
    const product = await createProduct()
    const update = {
      name: '2-pack white soft towels',
      price: 30,
    }
    const updated = await ProductService.update(product._id, update)
    expect(updated).toHaveProperty('_id', product._id)
    expect(updated).toHaveProperty('name', '2-pack white soft towels')
    expect(updated).toHaveProperty('price', 30)
  })

  it('should not update a non-existing product', async () => {
    const update = {
      name: '2-pack white soft towels',
      price: 30,
    }
    const updated = await ProductService.update(nonExistingProductId, update)
    expect(updated).toBe(null)
  })

  it('should delete an existing product', async () => {
    const product = await createProduct()
    await ProductService.deleteProduct(product._id)
    const foundProduct = await ProductService.findById(product._id)

    expect(foundProduct).toBe(null)
  })
})
