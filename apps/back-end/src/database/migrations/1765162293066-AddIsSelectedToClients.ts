import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsSelectedToClients1765162293066 implements MigrationInterface {
  name = 'AddIsSelectedToClients1765162293066';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clients" ADD "isSelected" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "isSelected"`);
  }
}
