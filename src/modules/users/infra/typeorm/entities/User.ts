/* eslint-disable camelcase */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import uploadConfig from '@config/upload'

import { Exclude, Expose } from 'class-transformer'

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  // varchar por default
  @Column()
  name: string

  @Column()
  email: string

  @Column()
  @Exclude()
  password: string

  @Column()
  avatar: string

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null
    }

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.avatar}`
      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.avatar}`
      default:
        return null
    }
  }

  @CreateDateColumn()
  // eslint-disable-next-line camelcase
  created_at: Date

  @UpdateDateColumn()
  // eslint-disable-next-line camelcase
  updated_at: Date
}

export default User
