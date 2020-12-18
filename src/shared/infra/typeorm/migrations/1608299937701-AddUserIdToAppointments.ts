import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm'

export default class AddUserIdToAppointments1608299937701
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'user_id',
        type: 'uuid', // o postgres tem suporte para um tipo uuid
        isNullable: true, // caso o usuário queira deletar a conta, o prestador não irá perder os logs
      }),
    )
    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        name: 'AppointmentUser',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // desfazer item por item em ordem reversa
    await queryRunner.dropForeignKey('appointments', 'AppointmentProvider')

    await queryRunner.dropColumn('appointments', 'user_id')
  }
}
