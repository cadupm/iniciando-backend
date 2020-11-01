import { Request, Response } from 'express'
import { container } from 'tsyringe'

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService'

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    // transformação de dados
    const { email, password } = request.body

    // const usersRepository = new UsersRepository()

    // regras de negocio
    // verificar se o email existe, se as senhas batem, gerar o token jwt, tudo isso no nosso service
    const authenticateUser = container.resolve(AuthenticateUserService)

    const { user, token } = await authenticateUser.execute({
      email,
      password,
    })

    delete user.password

    return response.json({ user, token })
  }
}
