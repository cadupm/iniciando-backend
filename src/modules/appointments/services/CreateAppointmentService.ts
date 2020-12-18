/* eslint-disable camelcase */
import { startOfHour, isBefore, getHours } from 'date-fns'
import { injectable, inject } from 'tsyringe'
// import { getCustomRepository } from 'typeorm'

import AppError from '@shared/errors/AppError'

import Appointment from '../infra/typeorm/entities/Appointment'
// import AppointmentsRepository from '../infra/typeorm/repositories/AppointmentsRepository'

import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

/*
    [x] Recebimento das informações/parametros
    [x] Trativa de erros/exceções
    [x] Acesso ao repositório
*/

// SOLID

// Single Responsabilty Principle [x]
// Open Closed Principle
// Liskov Substitution Principle [x]
// Interface Segregation Principle
// Dependecy Invertion Principle [x]

interface IRequest {
  provider_id: string
  user_id: string
  date: Date
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  // responsabilidade única
  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequest): Promise<Appointment> {
    // const appointmentsRepository = getCustomRepository(AppointmentsRepository)
    const appointmentDate = startOfHour(date)

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('Could not create an appointment on a past date.')
    }

    if (user_id === provider_id) {
      throw new AppError('Could not to create an appointment with yourself.')
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'Could not create an appointment not less between 8am and 5pm',
      )
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    )

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked')
    }

    // metodo create só cria a instancia do meu model, nao cria diretamente no banco de dados
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    })

    // salva a instancia criada previamente no banco de dados
    // await appointmentsRepository.save(appointment)

    return appointment
  }
}

export default CreateAppointmentService
