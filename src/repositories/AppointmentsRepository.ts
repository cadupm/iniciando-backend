// Repositório que tem a responsabilidade de entregar os dados, como salvar, criar
// A rota não deve a responsabilidade de se conectar com a fonte de dados da nossa aplicação e sim o repositório
// E o model tem a responsabilidade de tipagem dos dados que irão ser requeridos

// SoC: Separation of Concerns => separação de preocupações: cada parte do código, repositório, service deve ter uma única precupação
// A rota não pode ficar preocupada com a lógica de programação, com a regra de négocio da aplicação, onde os dados vao ser salvos, como as respostas devem ser retornadas.
// Precisamos separar as preocupações e refatorar.

// import { isEqual } from 'date-fns'
import { EntityRepository, Repository } from 'typeorm'
import Appointment from '../models/Appointment'

// utilizar o padrão do type ORM
/*
interface CreateAppointmentDTO {
  provider: string
  date: Date
} */

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  /* private appointments: Appointment[]

  constructor() {
    this.appointments = []
  } */

  public async findByDate(date: Date): Promise<Appointment | null> {
    /* const findAppointment = this.appointments.find(appointment =>
      isEqual(date, appointment.date),
    ) */
    const findAppointment = await this.findOne({
      where: { date },
    })

    return findAppointment || null
  }

  // metodos all e create já tem por padrão no typeORM
  // public create(provider: string, date: Date): Appointment {
  /* public create({ provider, date }: CreateAppointmentDTO): Appointment {
    const appointment = new Appointment({ provider, date })

    this.appointments.push(appointment)

    return appointment
  }
*/
  /* public getAll(): Appointment[] {
    return this.appointments
  } */
}

export default AppointmentsRepository
