import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateShoppingList1788358598242 implements MigrationInterface {
  name = 'CreateShoppingList1788358598242';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`shopping_lists\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`name\` varchar(150) NOT NULL, \`status\` enum ('ABERTA', 'CONCLUIDA') NOT NULL DEFAULT 'ABERTA', \`budget_limit\` decimal(10,2) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shopping_lists\` ADD CONSTRAINT \`FK_1851ac0f1c24464395dbb4df7b7\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`shopping_lists\` DROP FOREIGN KEY \`FK_1851ac0f1c24464395dbb4df7b7\``,
    );
    await queryRunner.query(`DROP TABLE \`shopping_lists\``);
  }
}
