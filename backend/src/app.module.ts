import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProducersModule } from './producers/producers.module';
import { PropertiesModule } from './properties/properties.module';
import { HarvestsModule } from './harvests/harvests.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [DatabaseModule, ProducersModule, PropertiesModule, HarvestsModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
