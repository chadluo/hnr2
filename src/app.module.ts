import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HNController } from './hn.controller';
import { HNService } from './hn.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController, HNController],
  providers: [AppService, HNService],
})
export class AppModule {}
