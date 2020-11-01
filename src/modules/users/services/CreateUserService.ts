import { hash } from 'bcryptjs'
// import { getRepository } from 'typeorm'
import AppError from '@shared/errors/AppError'
import { injectable, inject } from 'tsyringe'
import User from '../infra/typeorm/entities/User'
import IUsersRepository from '../repositories/IUsersRepository'

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
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    // utilizaremos apenas os metodos padroes: create, update, find, findOne, etc
    // Então usaremos o repository do typeorm que é o padrao
    // const usersRepository = getRepository(User)

    // antes de criar um usuário vamos fazer as verificacoes (regras de negócio)
    // checar se um usuário existe praquele email
    const checkUserExists = await this.usersRepository.findByEmail(email)

    if (checkUserExists) {
      throw new AppError('Email adress already used.')
    }

    // encrypt password
    const hashedPassword = await hash(password, 8)

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
