import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUniqueShopListItem1788540535820 implements MigrationInterface {
  name = 'UpdateUniqueShopListItem1788540535820';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM \`shopping_list_items\``);

    await queryRunner.query(
      `CREATE UNIQUE INDEX \`UQ_shopping_list_product\` ON \`shopping_list_items\` (\`shopping_list_id\`, \`product_id\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`UQ_shopping_list_product\` ON \`shopping_list_items\``,
    );
  }
}
