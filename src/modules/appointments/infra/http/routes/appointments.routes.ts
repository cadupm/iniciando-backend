/* eslint-disable camelcase */
import { Router } from 'express'
// import { uuid } from 'uuidv4'

// parseISO -> converte string para Date (formato nativo do JS)
// startOfHour -> próprio nome já disse mantendo as horas e zerando minutos/segundos
// isEqual -> verifica se duas datas sao iguais
// import Appointment from '../models/Appointment'

// DTO - Data Transfer Object => transferir dados de um file para outros files: ideal no JS fazer isso como objeto. Ideal seria usar desestrutruração para nomear os parametros.
// import { getCustomRepository } from 'typeorm'
// import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import AppointmentsController from '../controllers/AppointmentsController'

const appointmentsRouter = Router()
const appointmentsController = new AppointmentsController()

appointmentsRouter.use(ensureAuthenticated)

/* interface Appointment {
  id: string
  provider: string
  date: Date // por causa do parsedDate (na vdd, parseISO) ele virou uma Date
} */

// const appointments: Appointment[]
// const appointmentsRepository = new AppointmentsRepository()

appointmentsRouter.post('/', appointmentsController.create)

/* appointmentsRouter.get('/', async (request, response) => {
  // console.log(request.user)
  // const appointmentsRepository = getCustomRepository(AppointmentsRepository)
  const appointments = await appointmentsRepository.find()

  return response.json(appointments)
}) */

export default appointmentsRouter
