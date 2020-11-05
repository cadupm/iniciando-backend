/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import path from 'path'
// import { getRepository } from 'typeorm'
// import fs from 'fs'
import uploadConfig from '@config/upload'

import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'
import User from '../infra/typeorm/entities/User'
import IUsersRepository from '../repositories/IUsersRepository'

interface IRequest {
  user_id: string
  avatar_filename: string
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, avatar_filename }: IRequest): Promise<User> {
    // const usersRepository = getRepository(User)

    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401)
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar)
    }

    const filename = await this.storageProvider.saveFile(avatar_filename)

    user.avatar = filename

    await this.usersRepository.save(user)

    return user
  }
}

export default UpdateUserAvatarService
