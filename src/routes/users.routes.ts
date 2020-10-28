import { Router } from 'express'
import multer from 'multer'
import { getRepository } from 'typeorm'
import uploadConfig from '../config/upload'

import CreateUserService from '../services/CreateUserService'
import UpdateUserAvatarService from '../services/UpdateUserAvatarService'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import User from '../models/User'

const usersRouter = Router()
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

usersRouter.get('/', async (request, response) => {
  const usersRepository = getRepository(User)
  const users = await usersRepository.find()

  return response.json(users)
})

usersRouter.post('/', async (request, response) => {
  // transformação de dados
  const { name, email, password } = request.body
  // regras de negocio:
  // checar se um email é de apenas usuário cadastrado
  // password cripto
  const createUser = new CreateUserService()
  const user = await createUser.execute({
    name,
    email,
    password,
  })

  delete user.password

  return response.json(user)
})

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatarService()

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatar_filename: request.file.filename,
    })

    delete user.password

    return response.json(user)
  },
)

export default usersRouter
