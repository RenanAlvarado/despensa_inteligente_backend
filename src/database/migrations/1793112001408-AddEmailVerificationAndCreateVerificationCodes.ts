import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerificationAndCreateVerificationCodes1793112001408 implements MigrationInterface {
  name = 'AddEmailVerificationAndCreateVerificationCodes1793112001408';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`verification_codes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`code_hash\` varchar(255) NOT NULL, \`purpose\` enum ('EMAIL_VERIFICATION', 'PASSWORD_RESET') NOT NULL, \`expires_at\` datetime(6) NOT NULL, \`attempts\` int NOT NULL DEFAULT '0', \`consumed_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_verification_codes_expires_at\` (\`expires_at\`), INDEX \`IDX_verification_codes_user_purpose\` (\`user_id\`, \`purpose\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`email_verified\` tinyint NOT NULL DEFAULT 0`,
    );
    // Marca como verificados os usuários já cadastrados.
    await queryRunner.query(`UPDATE \`users\` SET \`email_verified\` = 1`);

    await queryRunner.query(
      `ALTER TABLE \`verification_codes\` ADD CONSTRAINT \`FK_0a53c41a810420ee446082ce6c6\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`verification_codes\` DROP FOREIGN KEY \`FK_0a53c41a810420ee446082ce6c6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`email_verified\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_verification_codes_user_purpose\` ON \`verification_codes\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_verification_codes_expires_at\` ON \`verification_codes\``,
    );
    await queryRunner.query(`DROP TABLE \`verification_codes\``);
  }
}
