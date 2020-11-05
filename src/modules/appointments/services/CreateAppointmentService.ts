/* eslint-disable camelcase */
import { startOfHour } from 'date-fns'
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
  date: Date
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  // responsabilidade única
  public async execute({ provider_id, date }: IRequest): Promise<Appointment> {
    // const appointmentsRepository = getCustomRepository(AppointmentsRepository)
    const appointmentDate = startOfHour(date)

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    )

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked')
    }

    // metodo create só cria a instancia do meu model, nao cria diretamente no banco de dados
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    })

    // salva a instancia criada previamente no banco de dados
    // await appointmentsRepository.save(appointment)

    return appointment
  }
}

export default CreateAppointmentService
