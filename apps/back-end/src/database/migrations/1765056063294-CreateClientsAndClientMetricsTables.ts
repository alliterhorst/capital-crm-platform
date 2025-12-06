import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClientsAndClientMetricsTables1765056063294 implements MigrationInterface {
  name = 'CreateClientsAndClientMetricsTables1765056063294';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "salary" numeric(10,2) NOT NULL, "companyValue" numeric(15,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "client_metrics" ("client_id" uuid NOT NULL, "views" integer NOT NULL DEFAULT '0', "last_viewed_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2e7df3e35981d943c8e7dde0df9" PRIMARY KEY ("client_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "client_metrics" ADD CONSTRAINT "FK_2e7df3e35981d943c8e7dde0df9" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client_metrics" DROP CONSTRAINT "FK_2e7df3e35981d943c8e7dde0df9"`,
    );
    await queryRunner.query(`DROP TABLE "client_metrics"`);
    await queryRunner.query(`DROP TABLE "clients"`);
  }
}
