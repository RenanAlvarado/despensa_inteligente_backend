import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGAndMLToProductUnitType1787754976191 implements MigrationInterface {
  name = 'AddGAndMLToProductUnitType1787754976191';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` CHANGE \`unit_type\` \`unit_type\` enum ('KG', 'G', 'L', 'ML', 'UN') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` CHANGE \`unit_type\` \`unit_type\` enum ('KG', 'L', 'UN') NOT NULL`,
    );
  }
}
