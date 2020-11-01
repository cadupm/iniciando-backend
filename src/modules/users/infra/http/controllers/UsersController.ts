import { Request, Response } from 'express'

import CreateUserService from '@modules/users/services/CreateUserService'
import { container } from 'tsyringe'

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    // transformando os dados
    const { name, email, password } = request.body
    // regras de negocio:
    // checar se um email é de apenas usuário cadastrado
    // password cripto
    // const usersRepository = new UsersRepository()
    const createUser = container.resolve(CreateUserService)
    const user = await createUser.execute({
      name,
      email,
      password,
    })

    delete user.password

    return response.json(user)
  }
}
