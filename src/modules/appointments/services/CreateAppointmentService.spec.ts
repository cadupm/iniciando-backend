import AppError from '@shared/errors/AppError'
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository'
import FakeAppointmentsRepository from '../repositories/fakes/FakesAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let fakeNotificationsRepository: FakeNotificationsRepository
let createAppointment: CreateAppointmentService

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    fakeNotificationsRepository = new FakeNotificationsRepository()

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    )
  })

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: 'userID',
      provider_id: 'providerID',
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('providerID')
  })

  it('should not be able to create an appointment at the same time of anothers', async () => {
    const appointmentDate = new Date(2100, 4, 10, 14)

    await createAppointment.execute({
      date: appointmentDate,
      user_id: 'userID1',
      provider_id: 'providerID',
    })

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: 'userID2',
        provider_id: 'providerID',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: 'userID',
        provider_id: 'providerID',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment with yourself, it means same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        user_id: 'sameID',
        provider_id: 'sameID',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment outside the schedule, it means before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 7),
        user_id: 'userID',
        provider_id: 'providerID',
      }),
    ).rejects.toBeInstanceOf(AppError)

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 18),
        user_id: 'userID',
        provider_id: 'providerID',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
