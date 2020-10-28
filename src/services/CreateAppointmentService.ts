/* eslint-disable camelcase */
import { startOfHour } from 'date-fns'
import { getCustomRepository } from 'typeorm'

import Appointment from '../models/Appointment'
import AppointmentsRepository from '../repositories/AppointmentsRepository'

import AppError from '../errors/AppError'

/*
    [x] Recebimento das informações/parametros
    [x] Trativa de erros/exceções
    [x] Acesso ao repositório
*/

// SOLID

// Single Responsabilty Principle
// Dependecy Invertion Principle

interface Request {
  provider_id: string
  date: Date
}

class CreateAppointmentService {
  /* private appointmentsRepository: AppointmentsRepository

  constructor(appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository
  } */

  // responsabilidade única
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository)
    const appointmentDate = startOfHour(date)

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    )

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked')
    }

    // metodo create só cria a instancia do meu model, nao cria diretamente no banco de dados
    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    })

    // salva a instancia criada previamente no banco de dados
    await appointmentsRepository.save(appointment)

    return appointment
  }
}

export default CreateAppointmentService
