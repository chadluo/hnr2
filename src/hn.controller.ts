import { Controller, Get } from '@nestjs/common';
import { HNService } from './hn.service';

@Controller('hn')
export class HNController {
  constructor(private readonly hnService: HNService) {}

  @Get()
  getHello(): string {
    return JSON.stringify(this.hnService.getItems());
  }
}
