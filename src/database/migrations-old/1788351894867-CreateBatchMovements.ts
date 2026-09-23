import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBatchMovements1788351894867 implements MigrationInterface {
  name = 'CreateBatchMovements1788351894867';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`batch_movements\` (\`id\` int NOT NULL AUTO_INCREMENT, \`batch_id\` int NOT NULL, \`type\` enum ('ENTRADA', 'CONSUMO', 'DESCARTE', 'AJUSTE') NOT NULL, \`reason\` varchar(255) NULL, \`quantity\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`batch_movements\` ADD CONSTRAINT \`FK_5435e1016582980b13b2bcb629a\` FOREIGN KEY (\`batch_id\`) REFERENCES \`batches\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`batch_movements\` DROP FOREIGN KEY \`FK_5435e1016582980b13b2bcb629a\``,
    );
    await queryRunner.query(`DROP TABLE \`batch_movements\``);
  }
}
