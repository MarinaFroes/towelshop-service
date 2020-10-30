import { UserDocument } from '../../src/models/User'
import UserService from '../../src/services/user'
import CartService from '../../src/services/cart'
import ProductService from '../../src/services/product'
import Product from '../../src/models/Product'
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

  const { userName, firstName, lastName, email, password, role } = user
  return await UserService.create(userName, firstName, lastName, email, password, role)
}

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

describe('user service', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should get a cart', async () => { 
    const user = await createUser()

    const cart = await CartService.findByUserId(user._id)

    expect(cart?.user).toEqual(user._id)
    expect(cart?.products.length).toBe(0)
  })

  it('should not get a cart for a non-existing user', async () => { 
    const cart = await CartService.findByUserId(nonExistingUserId)

    expect(cart).toBe(null)
  })

  it('should get all carts', async () => { 
    await createUser()
    await createUser({ email: 'user1@example.com'})

    const carts = await CartService.findAll()

    expect(carts.length).toBe(2)
  })

  it('should add product to cart', async () => { 
    const user = await createUser()
    const userId = user._id
    
    const product = await createProduct()
    const qty = 3

    let cart = await CartService.update(userId, product._id, qty)

    expect(cart?.products.length).toBe(1)
    expect(cart?.products[0].quantity).toBe(3)

    cart = await CartService.update(userId, product._id, qty)

    expect(cart?.products.length).toBe(1)
    expect(cart?.products[0].quantity).toBe(6)
  })

  it('should remove product from cart', async () => { 
    const user = await createUser()
    const userId = user._id
   
    const product = await createProduct()
    const qty = 3

    let cart = await CartService.update(userId, product._id, qty)

    cart = await CartService.deleteProduct(userId, product._id)

    expect(cart?.products.length).toBe(0)
  })
})