import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProducts1787601770266 implements MigrationInterface {
  name = 'CreateProducts1787601770266';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`brand_id\` int NOT NULL, \`category_id\` int NOT NULL, \`name\` varchar(150) NOT NULL, \`barcode\` varchar(100) NULL, \`image_url\` varchar(500) NOT NULL, \`unit_type\` enum ('KG', 'L', 'UN') NOT NULL, \`unit_quantity\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_adfc522baf9d9b19cd7d9461b7\` (\`barcode\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`FK_1530a6f15d3c79d1b70be98f2be\` FOREIGN KEY (\`brand_id\`) REFERENCES \`brands\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`FK_9a5f6868c96e0069e699f33e124\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_9a5f6868c96e0069e699f33e124\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_1530a6f15d3c79d1b70be98f2be\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_adfc522baf9d9b19cd7d9461b7\` ON \`products\``,
    );
    await queryRunner.query(`DROP TABLE \`products\``);
  }
}
