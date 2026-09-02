import { Module } from '@nestjs/common';
import { BatchMovementsService } from './batch-movements.service';
import { BatchMovementsController } from './batch-movements.controller';
import { BatchMovement } from './entities/batch-movement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchesModule } from '../batches/batches.module';

@Module({
  imports: [TypeOrmModule.forFeature([BatchMovement]), BatchesModule],
  controllers: [BatchMovementsController],
  providers: [BatchMovementsService],
})
export class BatchMovementsModule {}
