import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateShoppingListWithCascade1788358680329 implements MigrationInterface {
  name = 'UpdateShoppingListWithCascade1788358680329';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`shopping_lists\` DROP FOREIGN KEY \`FK_1851ac0f1c24464395dbb4df7b7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`shopping_lists\` ADD CONSTRAINT \`FK_1851ac0f1c24464395dbb4df7b7\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`shopping_lists\` DROP FOREIGN KEY \`FK_1851ac0f1c24464395dbb4df7b7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`shopping_lists\` ADD CONSTRAINT \`FK_1851ac0f1c24464395dbb4df7b7\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
