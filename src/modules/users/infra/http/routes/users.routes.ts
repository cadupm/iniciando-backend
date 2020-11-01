import { Router } from 'express'
import multer from 'multer'
// import { getRepository } from 'typeorm'
import uploadConfig from '@config/upload'

// import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository'

import UsersController from '../controllers/UsersController'
import UserAvatarController from '../controllers/UserAvatarController'

import ensureAuthenticated from '../middlewares/ensureAuthenticated'

// import User from '../../typeorm/entities/User'

const usersRouter = Router()

const usersController = new UsersController()
const userAvatarController = new UserAvatarController()

const upload = multer(uploadConfig)

// upload de um único arquivo
// upload.single()

/* interface Appointment {
  id: string
  provider: string
  date: Date // por causa do parsedDate (na vdd, parseISO) ele virou uma Date
} */

// const appointments: Appointment[]
// const appointmentsRepository = new AppointmentsRepository()

/* usersRouter.get('/', async (request, response) => {
  const usersRepository = getRepository(User)
  const users = await usersRepository.find()

  return response.json(users)
}) */

usersRouter.post('/', usersController.create)

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
)

export default usersRouter
