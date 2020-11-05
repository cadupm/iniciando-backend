import AppError from '@shared/errors/AppError'
import FakeAppointmentsRepository from '../repositories/fakes/FakesAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository()
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    )

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123123',
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('123123')
  })

  it('should not be able to create an appointment at the same time of anothers', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository()
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    )

    const appointmentDate = new Date()

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123',
    })

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '124124',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
