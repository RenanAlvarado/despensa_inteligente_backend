import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDeleteCascadeBatchesAndUsers1788295163412 implements MigrationInterface {
  name = 'UpdateDeleteCascadeBatchesAndUsers1788295163412';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`batches\` DROP FOREIGN KEY \`FK_60970a4f473cdc24a703a83b269\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`batches\` ADD CONSTRAINT \`FK_60970a4f473cdc24a703a83b269\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`batches\` DROP FOREIGN KEY \`FK_60970a4f473cdc24a703a83b269\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`batches\` ADD CONSTRAINT \`FK_60970a4f473cdc24a703a83b269\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
