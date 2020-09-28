import { Test } from '@nestjs/testing';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import MicroORMConfig from '../src/mikro-orm.config';
import { EntityManager } from '@mikro-orm/knex';
import { UserModule } from '../src/user/user.module'
import { INestApplication } from '@nestjs/common';
import { User } from '../src/user/user.entity';
import { wrap } from '@mikro-orm/core';

export interface CRUDe2eSeed<Entity = any, CreateDTO = any> {
  initialize?: (em: EntityManager) => Promise<void>;
  initialList: Entity[];
  createSchemas: { input: CreateDTO; output: Partial<Entity> }[] | CreateDTO[];
  updateSchema: [string, any];
  updateResult?: any;
}

describe('wrap repro', () => {
    let app: INestApplication;

    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          MikroOrmModule.forRoot({
            ...MicroORMConfig,
            dbName: 'test',
            user: 'test',
            password: 'test',
          }),
          UserModule,
        ],
      }).compile();

      app = moduleRef.createNestApplication();
      await app.init();
    });

    it('should work', async () => {
      const user = new User('test', 'test@test.com', 'testtest');
      const wrapedUser = wrap(user);
      const reference = wrapedUser.toReference();

      expect(reference).toBeTruthy();
    })

    afterAll(async () => {
      await app.close();
    });
  });
