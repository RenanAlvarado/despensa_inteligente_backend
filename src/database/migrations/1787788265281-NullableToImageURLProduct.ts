import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableToImageURLProduct1787788265281 implements MigrationInterface {
  name = 'NullableToImageURLProduct1787788265281';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` CHANGE \`image_url\` \`image_url\` varchar(500) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` CHANGE \`image_url\` \`image_url\` varchar(500) NOT NULL`,
    );
  }
}
