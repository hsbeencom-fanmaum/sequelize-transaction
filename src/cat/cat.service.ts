import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Cat } from './entity/cat.entity';
import { Sequelize } from 'sequelize-typescript';
import { LOCK, Transaction } from 'sequelize';

@Injectable()
export class CatService {
  constructor(
    @Inject('SEQUELIZE')
    private readonly sequelizeInstance: Sequelize,
    @Inject('CAT_REPOSITORY')
    private catsRepository: typeof Cat,
  ) {}

  async findAll(): Promise<Cat[]> {
    return await this.catsRepository.findAll<Cat>();
  }

  async transaction(age: number) {
    try {
      return await this.sequelizeInstance.transaction(
        {
          autocommit: false,
        },
        async (t) => {
          // 테이블 잠금 (먼저 들어온 트랜잭션이 끝나야 사용 가능)
          await this.sequelizeInstance.query('lock table "Cats"', {
            transaction: t,
          });

          // hi라는 이름의 고양이를 조회
          const hiCat = await this.catsRepository.findOne({
            where: {
              name: 'hi',
            },
            transaction: t,
          });

          // 이미 있다면 에러 리턴
          if (hiCat) {
            throw new BadRequestException();
          }

          // 없다면 생성
          return await this.catsRepository.create(
            {
              name: 'hi',
              age,
              breed: 'test',
            },
            { transaction: t },
          );
        },
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
