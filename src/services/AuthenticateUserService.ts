import { getRepository } from 'typeorm'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import authConfig from '../config/auth'

import User from '../models/User'

import AppError from '../errors/AppError'

interface Request {
  email: string
  password: string
}

interface Response {
  user: User
  token: string
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User)

    // verificando se é um email cadastrado
    const user = await usersRepository.findOne({
      where: { email },
    })

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
