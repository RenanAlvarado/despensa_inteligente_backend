import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserWithRoles1790082763786 implements MigrationInterface {
  name = 'UpdateUserWithRoles1790082763786';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`role\` enum ('USER', 'ADMIN') NOT NULL DEFAULT 'USER'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`role\``);
  }
}
