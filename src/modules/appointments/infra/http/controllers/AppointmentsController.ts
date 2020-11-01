import { Request, Response } from 'express'

import { parseISO } from 'date-fns'
import { container } from 'tsyringe'

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    // transformação de dados
    const { provider_id, date } = request.body

    const parsedDate = parseISO(date)

    // const appointmentsRepository = new AppointmentsRepository()
    const appointmentService = container.resolve(CreateAppointmentService)

    const appointment = await appointmentService.execute({
      provider_id,
      date: parsedDate,
    })

    return response.json(appointment)
  }
}
