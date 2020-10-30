import { UserDocument } from '../../src/models/User'
import UserService from '../../src/services/user'
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

  it('should create a user', async () => {
    const user = await createUser()

    expect(user).toHaveProperty('_id')
    expect(user).toHaveProperty('userName', 'fprefect')
    expect(user).toHaveProperty('firstName', 'Ford')
    expect(user).toHaveProperty('lastName', 'Prefect')
    expect(user).toHaveProperty('email', 'fprefect@example.com')
    expect(user).toHaveProperty('password')
    expect(user).toHaveProperty('isBanned', false)
    expect(user).toHaveProperty('role', 'admin')
  })

  it('should authenticate user', async () => {
    const user = await createUser()
    const email = 'fprefect@example.com'
    const password = '123456'
    
    const authedUser = await UserService.authenticate(email, password)

    expect(authedUser?._id).toEqual(user._id)
  })

  it('should not authenticate user with wrong credentials', async () => {
    await createUser()
    const email = 'fprefect@example.com'
    const password = 'wrong!'
    
    const authedUser = await UserService.authenticate(email, password)

    expect(authedUser?._id).toBe(undefined)
  })

  it('should get all users', async () => {
    const user0 = await createUser()
    const user1 = await createUser({email: 'user@example.com'})
    const user2 = await createUser({email: 'user1@example.com'})
    const user3 = await createUser({email: 'user2@example.com'})

    const userList = await UserService.findAll()
    expect(userList.length).toEqual(4)
    expect(userList[0]._id).toEqual(user0._id)
    expect(userList[1]._id).toEqual(user1._id)
    expect(userList[2]._id).toEqual(user2._id)
    expect(userList[3]._id).toEqual(user3._id)
  })

  it('should get a user with id', async () => {
    const user = await createUser()
    const found = await UserService.findById(user._id)
    expect(found?.userName).toEqual(user.userName)
    expect(found?._id).toEqual(user._id)
  })

  it('should not get a non-existing user', async () => {
    const user = await UserService.findById(nonExistingUserId)
    expect(user).toBe(null)
  })

  it('should update an existing user', async () => {
    const user = await createUser()
    const update = {
      userName: 'FordPrefect',
      email: 'fordprefect@example.com'
    }

    const updated = await UserService.update(user._id, update)
    expect(updated).toHaveProperty('_id', user._id)
    expect(updated).toHaveProperty('userName', 'FordPrefect')
    expect(updated).toHaveProperty('email', 'fordprefect@example.com')
  })

  it('should not update an non-existing user', async () => {
    const update = {
      userName: 'FordPrefect',
      email: 'fordprefect@example.com'
    }

    const updated = await UserService.update(nonExistingUserId, update)
    expect(updated).toBe(null)
  })

  it('should delete an existing user', async () => {
    const user = await createUser()
    await UserService.deleteUser(user._id)
    const foundUser = await UserService.findById(user._id) 

    expect(foundUser).toBe(null)
  })

  it('should ban user', async () => {
    expect.assertions(1)
    const user = await createUser()
    await UserService.ban(user._id)
    const foundUser = await UserService.findById(user._id) 

    expect(foundUser?.isBanned).toBe(true)
  })

  it('should unban user', async () => {
    const user = await createUser()
    await UserService.ban(user._id)

    let foundUser = await UserService.findById(user._id)
    expect(foundUser?.isBanned).toBe(true)

    await UserService.unban(user._id)
    foundUser = await UserService.findById(user._id) 

    expect(foundUser?.isBanned).toBe(false)
  })

})