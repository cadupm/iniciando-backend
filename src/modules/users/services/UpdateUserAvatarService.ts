/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import path from 'path'
// import { getRepository } from 'typeorm'
import fs from 'fs'
import uploadConfig from '@config/upload'

import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
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
  ) {}

  public async execute({ user_id, avatar_filename }: IRequest): Promise<User> {
    // const usersRepository = getRepository(User)

    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401)
    }

    if (user.avatar) {
      // Deletar avatar anterior

      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar)
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath)

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath)
      }
    }

    user.avatar = avatar_filename

    await this.usersRepository.save(user)

    return user
  }
}

export default UpdateUserAvatarService