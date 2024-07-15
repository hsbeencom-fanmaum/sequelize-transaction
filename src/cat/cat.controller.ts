import { Controller, Get } from '@nestjs/common';
import { CatService } from './cat.service';

@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Get()
  async getAllCats() {
    return await this.catService.findAll();
  }

  @Get('test')
  async test() {
    return await Promise.all([
      this.catService.transaction(10),
      this.catService.transaction(20),
    ]);
  }
}
