import { Router } from 'express'

// import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository'
import SessionsController from '../controllers/SessionsController'

const sessionsController = new SessionsController()

const sessionsRouter = Router()
sessionsRouter.post('/', sessionsController.create)

export default sessionsRouter
