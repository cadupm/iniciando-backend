/* eslint-disable camelcase */
import { Router } from 'express'
// import { uuid } from 'uuidv4'
import { parseISO } from 'date-fns'
// parseISO -> converte string para Date (formato nativo do JS)
// startOfHour -> próprio nome já disse mantendo as horas e zerando minutos/segundos
// isEqual -> verifica se duas datas sao iguais
// import Appointment from '../models/Appointment'

// DTO - Data Transfer Object => transferir dados de um file para outros files: ideal no JS fazer isso como objeto. Ideal seria usar desestrutruração para nomear os parametros.
import { getCustomRepository } from 'typeorm'
import AppointmentsRepository from '../repositories/AppointmentsRepository'
import CreateAppointmentService from '../services/CreateAppointmentService'

import ensureAuthenticated from '../middlewares/ensureAuthenticated'

const appointmentsRouter = Router()

appointmentsRouter.use(ensureAuthenticated)

/* interface Appointment {
  id: string
  provider: string
  date: Date // por causa do parsedDate (na vdd, parseISO) ele virou uma Date
} */

// const appointments: Appointment[]
// const appointmentsRepository = new AppointmentsRepository()

appointmentsRouter.post('/', async (request, response) => {
  // transformação de dados
  const { provider_id, date } = request.body

  const parsedDate = parseISO(date)

  const appointmentService = new CreateAppointmentService()

  const appointment = await appointmentService.execute({
    provider_id,
    date: parsedDate,
  })

  return response.json(appointment)
})

appointmentsRouter.get('/', async (request, response) => {
  // console.log(request.user)
  const appointmentsRepository = getCustomRepository(AppointmentsRepository)
  const appointments = await appointmentsRepository.find()

  return response.json(appointments)
})

export default appointmentsRouter
