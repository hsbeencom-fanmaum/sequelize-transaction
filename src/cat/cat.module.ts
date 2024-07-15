import { Module } from '@nestjs/common';
import { CatService } from './cat.service';
import { SequelizeModule } from 'src/sequelize/sequelize.module';
import { catProviders } from './cat.providers';
import { CatController } from './cat.controller';

@Module({
  imports: [SequelizeModule],
  controllers: [CatController],
  providers: [CatService, ...catProviders],
})
export class CatModule {}
