import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { UserModule } from '../src/user/user.module';
import { AuthModule } from '../src/auth/auth.module';
import { User } from '../src/user/user.entity';
import { Company } from '../src/company/company.entity';
import { Celeb } from '../src/celeb/celeb.entity';
import { Favorite } from '../src/favorite/favorite.entity';
import { Post } from '../src/post/post.entity';
import { Schedule } from '../src/schedule/schedule.entity';
import { Goods } from '../src/goods/goods.entity';
import { LoginLog } from '../src/login-log/login-log.entity';
import { Comment } from '../src/comment/comment.entity';
import { CompanyModule } from '../src/company/company.module';
import { CelebModule } from '../src/celeb/celeb.module';
import { FavoriteModule } from '../src/favorite/favorite.module';
import { PostModule } from '../src/post/post.module';
import { ScheduleModule } from '../src/schedule/schedule.module';
import { GoodsModule } from '../src/goods/goods.module';
import { LoginLogModule } from '../src/login-log/login-log.module';
import { CommentModule } from '../src/comment/comment.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: number;

  beforeAll(async () => {
    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      app.setGlobalPrefix('api');
      app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }));
      await app.init();
    } catch (e) {
      console.error('Error during test setup:', e);
      throw e;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  const testUser = {
    username: `testuser_${Date.now()}`,
    password: 'password123',
    mail: `test_${Date.now()}@example.com`,
    nickname: 'testnickname',
    position: 'fan',
  };

  it('POST /users/register - should register a new user', () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send(testUser)
      .expect(201);
  });

  it('POST /auth/login - should login the user and return a token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: testUser.username,
        password: testUser.password,
      })
      .expect(200);

    expect(response.body.access_token).toBeDefined();
    expect(response.body.user_id).toBeDefined();
    accessToken = response.body.access_token;
    userId = response.body.user_id;
  });

  it('GET /users/:user_id - should get user profile information', () => {
    return request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`) // Auth needed for this as per controller
      .expect(200)
      .expect((res) => {
        expect(res.body.nickname).toEqual(testUser.nickname);
        expect(res.body.position).toEqual(testUser.position);
      });
  });

  it('PATCH /users/:user_id - should update user information', () => {
    const newNickname = 'updatedNickname';
    return request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nickname: newNickname })
      .expect(200)
      .expect((res) => {
        expect(res.body.nickname).toEqual(newNickname);
      });
  });

  it('DELETE /users/:user_id - should delete the user', () => {
    return request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });

  it('GET /users/:user_id - should fail to get profile of deleted user', () => {
    return request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`) // Auth needed
      .expect(404);
  });
});