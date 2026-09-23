import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductSource1788200747535 implements MigrationInterface {
  name = 'AddProductSource1788200747535';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD \`source\` enum ('MANUAL', 'OPEN_FOOD_FACTS') NULL`,
    );

    await queryRunner.query(
      `UPDATE \`products\`
       SET \`source\` = 'OPEN_FOOD_FACTS'
       WHERE \`source\` IS NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE \`products\`
       MODIFY \`source\` enum ('MANUAL', 'OPEN_FOOD_FACTS') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`source\``);
  }
}
