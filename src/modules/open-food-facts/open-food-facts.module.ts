import { Module } from '@nestjs/common';
import { OpenFoodFactsService } from './open-food-facts.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [OpenFoodFactsService],
  exports: [OpenFoodFactsService],
})
export class OpenFoodFactsModule {}
