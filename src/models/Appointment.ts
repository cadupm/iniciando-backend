/* eslint-disable camelcase */
// toda vez que criamos um tipo de dado que vai ser armazenado na aplicação seja no bd, na memória.
// iremos criar um model ou entity, como queira chamar.
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
// import { uuid } from 'uuidv4'

/* interface AppointmentConstructor {
  provider: string
  date: Date
} */
import User from './User'

@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column() // varchar é o default e fica em branco
  provider_id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'provider_id' })
  provider: User

  @Column('timestamp with time zone')
  date: Date

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

// o constructor já é feito por baixo dos panos pelo TypeORM
// constructor( { provider, date}: AppointmentConstructor) {
// constructor({ provider, date }: Omit<Appointment, 'id'>) {
// Omit serve para tipar de acordo com a interface exceto com o 'id'
// this.id = uuid()
// this.provider = provider
// this.date = date
// }

export default Appointment
