import { Controller, Get } from '@nestjs/common';
import { HNService } from './hn.service';

@Controller()
export class AppController {
  constructor(private readonly hnService: HNService) {}

  @Get()
  getHello(): string {
    return JSON.stringify(this.hnService.getItems());
  }
}
