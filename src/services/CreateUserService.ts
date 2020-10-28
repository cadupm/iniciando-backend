import { hash } from 'bcryptjs'
import { getRepository } from 'typeorm'
import User from '../models/User'

import AppError from '../errors/AppError'

interface Request {
  name: string
  email: string
  password: string
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    // utilizaremos apenas os metodos padroes: create, update, find, findOne, etc
    // Então usaremos o repository do typeorm que é o padrao
    const usersRepository = getRepository(User)

    // antes de criar um usuário vamos fazer as verificacoes (regras de negócio)
    // checar se um usuário existe praquele email
    const checkUserExists = await usersRepository.findOne({
      where: { email },
    })

    if (checkUserExists) {
      throw new AppError('Email adress already used.')
    }

    // encrypt password
    const hashedPassword = await hash(password, 8)

    // é um método sync que cria apenas a instancia da classe de usuarios, não salva no banco
    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    })

    // salvando o usuário no banco e depois retorno o mesmo
    await usersRepository.save(user)

    return user
  }
}

export default CreateUserService
