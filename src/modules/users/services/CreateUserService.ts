// import { getRepository } from 'typeorm'
import AppError from '@shared/errors/AppError'
import { injectable, inject } from 'tsyringe'
import User from '../infra/typeorm/entities/User'
import IUsersRepository from '../repositories/IUsersRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'

interface IRequest {
  name: string
  email: string
  password: string
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email)

    if (checkUserExists) {
      throw new AppError('Email address already used.')
    }

    // encrypt password
    const hashedPassword = await this.hashProvider.generateHash(password)

    // é um método sync que cria apenas a instancia da classe de usuarios, não salva no banco
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    })

    // salvando o usuário no banco e depois retorno o mesmo
    // await usersRepository.save(user)

    return user
  }
}

export default CreateUserService
