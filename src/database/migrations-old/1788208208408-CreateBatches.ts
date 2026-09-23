import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBatches1788208208408 implements MigrationInterface {
  name = 'CreateBatches1788208208408';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`batches\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`product_id\` int NOT NULL, \`expiration_date\` date NOT NULL, \`purchase_date\` date NOT NULL, \`quantity\` int NOT NULL, \`unit_price\` decimal(10,2) NOT NULL, \`notes\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`batches\` ADD CONSTRAINT \`FK_60970a4f473cdc24a703a83b269\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`batches\` ADD CONSTRAINT \`FK_07ad38527d0d87601f3b05a6a22\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`batches\` DROP FOREIGN KEY \`FK_07ad38527d0d87601f3b05a6a22\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`batches\` DROP FOREIGN KEY \`FK_60970a4f473cdc24a703a83b269\``,
    );
    await queryRunner.query(`DROP TABLE \`batches\``);
  }
}
