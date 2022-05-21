import { Controller, Get } from '@nestjs/common';
import { HNService, NewsItem } from './hn.service';

@Controller('hn')
export class HNController {
  constructor(private readonly hnService: HNService) {}

  @Get()
  getHello(): NewsItem[] {
    return this.hnService.getItems();
  }
}
