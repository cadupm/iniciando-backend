import { Router } from 'express'

import AuthenticateUserService from '../services/AuthenticateUserService'

const sessionsRouter = Router()
sessionsRouter.post('/', async (request, response) => {
  // transformação de dados
  const { email, password } = request.body
  // regras de negocio
  // verificar se o email existe, se as senhas batem, gerar o token jwt, tudo isso no nosso service
  const authenticateUser = new AuthenticateUserService()

  const { user, token } = await authenticateUser.execute({
    email,
    password,
  })

  delete user.password

  return response.json({ user, token })
})

export default sessionsRouter
