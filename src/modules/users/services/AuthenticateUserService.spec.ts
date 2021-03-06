import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

import AuthenticateUserService from './AuthenticateUserService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let authenticateUser: AuthenticateUserService

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )
  })

  it('should be able to authenticate an user that is signed up', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const response = await authenticateUser.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response).toHaveProperty('token')
  })

  it('should not be able to authenticate an non-existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'non-existing-user',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to log in with a wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'Joe Biden',
      email: 'joebiden@usa.com',
      password: 'yeswecan2021',
    })

    await expect(
      authenticateUser.execute({
        email: 'joebiden@usa.com',
        password: 'ilovetrump',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
