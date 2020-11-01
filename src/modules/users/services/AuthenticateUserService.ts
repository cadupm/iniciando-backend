// import { getRepository } from 'typeorm'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import authConfig from '@config/auth'
import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import User from '../infra/typeorm/entities/User'
import IUsersRepository from '../repositories/IUsersRepository'

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: User
  token: string
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    // const usersRepository = getRepository(User)

    // verificando se é um email cadastrado
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401)
    }

    // user.password -> senha criptografada salva dentro do banco de dados
    // password - senha não criptografada que ele tentou fazer um login
    // bcryptjs tem um método que consegue comparar (COMPARE) uma senha crypt com uma uncrypt e ve se elas são equivalentes
    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError('Inccorect email/password combination.', 401)
    }

    // Chegou até aqui, usuário autenticado
    // Gerando um token JWT
    const { secret, expiresIn } = authConfig.jwt

    const token = sign({}, secret, {
      // primeiro parametro é um payload, não é seguro só é encrypt, so coloque info que não são essenciais
      subject: user.id,
      expiresIn,
    })

    return {
      user,
      token,
    }
  }
}

export default AuthenticateUserService
