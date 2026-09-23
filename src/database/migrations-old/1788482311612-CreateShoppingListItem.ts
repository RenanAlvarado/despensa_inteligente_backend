import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateShoppingListItem1788482311612 implements MigrationInterface {
  name = 'CreateShoppingListItem1788482311612';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`shopping_list_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`shopping_list_id\` int NOT NULL, \`product_id\` int NOT NULL, \`requested_quantity\` int NOT NULL, \`purchased_quantity\` int NOT NULL DEFAULT '0', \`status\` enum ('PENDENTE', 'PARCIAL', 'CONCLUIDO') NOT NULL DEFAULT 'PENDENTE', \`notes\` text NULL, \`unit_price\` decimal(10,2) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shopping_list_items\` ADD CONSTRAINT \`FK_05e6a9394e4ec5b78f15be7fe6a\` FOREIGN KEY (\`shopping_list_id\`) REFERENCES \`shopping_lists\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shopping_list_items\` ADD CONSTRAINT \`FK_2b7cdc20ef2ccc347037432d769\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`shopping_list_items\` DROP FOREIGN KEY \`FK_2b7cdc20ef2ccc347037432d769\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`shopping_list_items\` DROP FOREIGN KEY \`FK_05e6a9394e4ec5b78f15be7fe6a\``,
    );
    await queryRunner.query(`DROP TABLE \`shopping_list_items\``);
  }
}
