import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateV1Schema1790167511824 implements MigrationInterface {
  name = 'CreateV1Schema1790167511824';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`email\` varchar(255) NOT NULL,
                \`password_hash\` varchar(255) NOT NULL,
                \`role\` enum ('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`brands\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(100) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`IDX_96db6bbbaa6f23cad26871339b\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`categories\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(100) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`IDX_8b0be371d28245da6e4f4b6187\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`products\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`brand_id\` int NULL,
                \`category_id\` int NULL,
                \`name\` varchar(150) NOT NULL,
                \`barcode\` varchar(100) NULL,
                \`image_url\` varchar(500) NULL,
                \`unit_type\` enum ('KG', 'G', 'L', 'ML', 'UN') NULL,
                \`unit_quantity\` int NULL,
                \`source\` enum ('MANUAL', 'OPEN_FOOD_FACTS') NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`IDX_adfc522baf9d9b19cd7d9461b7\` (\`barcode\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`batches\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`product_id\` int NOT NULL,
                \`expiration_date\` date NOT NULL,
                \`purchase_date\` date NOT NULL,
                \`quantity\` int NOT NULL,
                \`unit_price\` decimal(10, 2) NOT NULL,
                \`notes\` text NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`batch_movements\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`batch_id\` int NOT NULL,
                \`type\` enum ('ENTRADA', 'CONSUMO', 'DESCARTE', 'AJUSTE') NOT NULL,
                \`reason\` varchar(255) NULL,
                \`quantity\` int NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`shopping_lists\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`name\` varchar(150) NOT NULL,
                \`status\` enum ('ABERTA', 'CONCLUIDA') NOT NULL DEFAULT 'ABERTA',
                \`budget_limit\` decimal(10, 2) NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`shopping_list_items\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`shopping_list_id\` int NOT NULL,
                \`product_id\` int NOT NULL,
                \`requested_quantity\` int NOT NULL,
                \`purchased_quantity\` int NOT NULL DEFAULT '0',
                \`status\` enum ('PENDENTE', 'PARCIAL', 'CONCLUIDO') NOT NULL DEFAULT 'PENDENTE',
                \`notes\` text NULL,
                \`unit_price\` decimal(10, 2) NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`UQ_shopping_list_product\` (\`shopping_list_id\`, \`product_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD CONSTRAINT \`FK_1530a6f15d3c79d1b70be98f2be\` FOREIGN KEY (\`brand_id\`) REFERENCES \`brands\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD CONSTRAINT \`FK_9a5f6868c96e0069e699f33e124\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`batches\`
            ADD CONSTRAINT \`FK_60970a4f473cdc24a703a83b269\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`batches\`
            ADD CONSTRAINT \`FK_07ad38527d0d87601f3b05a6a22\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`batch_movements\`
            ADD CONSTRAINT \`FK_5435e1016582980b13b2bcb629a\` FOREIGN KEY (\`batch_id\`) REFERENCES \`batches\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`shopping_lists\`
            ADD CONSTRAINT \`FK_1851ac0f1c24464395dbb4df7b7\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`shopping_list_items\`
            ADD CONSTRAINT \`FK_05e6a9394e4ec5b78f15be7fe6a\` FOREIGN KEY (\`shopping_list_id\`) REFERENCES \`shopping_lists\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`shopping_list_items\`
            ADD CONSTRAINT \`FK_2b7cdc20ef2ccc347037432d769\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`shopping_list_items\` DROP FOREIGN KEY \`FK_2b7cdc20ef2ccc347037432d769\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`shopping_list_items\` DROP FOREIGN KEY \`FK_05e6a9394e4ec5b78f15be7fe6a\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`shopping_lists\` DROP FOREIGN KEY \`FK_1851ac0f1c24464395dbb4df7b7\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`batch_movements\` DROP FOREIGN KEY \`FK_5435e1016582980b13b2bcb629a\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`batches\` DROP FOREIGN KEY \`FK_07ad38527d0d87601f3b05a6a22\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`batches\` DROP FOREIGN KEY \`FK_60970a4f473cdc24a703a83b269\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_9a5f6868c96e0069e699f33e124\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_1530a6f15d3c79d1b70be98f2be\`
        `);
    await queryRunner.query(`
            DROP INDEX \`UQ_shopping_list_product\` ON \`shopping_list_items\`
        `);
    await queryRunner.query(`
            DROP TABLE \`shopping_list_items\`
        `);
    await queryRunner.query(`
            DROP TABLE \`shopping_lists\`
        `);
    await queryRunner.query(`
            DROP TABLE \`batch_movements\`
        `);
    await queryRunner.query(`
            DROP TABLE \`batches\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_adfc522baf9d9b19cd7d9461b7\` ON \`products\`
        `);
    await queryRunner.query(`
            DROP TABLE \`products\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_8b0be371d28245da6e4f4b6187\` ON \`categories\`
        `);
    await queryRunner.query(`
            DROP TABLE \`categories\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_96db6bbbaa6f23cad26871339b\` ON \`brands\`
        `);
    await queryRunner.query(`
            DROP TABLE \`brands\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\`
        `);
    await queryRunner.query(`
            DROP TABLE \`users\`
        `);
  }
}
