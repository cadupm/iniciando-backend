import AppError from '@shared/errors/AppError'

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'

import UpdateUserAvatarService from './UpdateUserAvatarService'

let fakeUsersRepository: FakeUsersRepository
let fakeStorageProvider: FakeStorageProvider
let updateUserAvatar: UpdateUserAvatarService

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeStorageProvider = new FakeStorageProvider()

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    )
  })

  it('should be able to update an avatar from a existing user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatar_filename: 'avatar.jpg',
    })

    expect(user.avatar).toBe('avatar.jpg')
  })

  it('should not be able to update a non-existing user avatar', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatar_filename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should delete old avatar when new one is setted', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatar_filename: 'avatar.jpg',
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatar_filename: 'avatar2.jpg',
    })

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg')
    expect(user.avatar).toBe('avatar2.jpg')
  })
})
