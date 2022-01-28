'use strict';
const request = require('supertest');
const app = require('../app');
const passportStub = require('passport-stub');

//ログインテスト
describe('/login', () => {
  passportStub.logout();
  passportStub.uninstall(app);
  
  beforeAll(() => {
    passportStub.logout();
    passportStub.uninstall(app);
    passportStub.install(app);
    passportStub.login({ username: 'testuser' });
  });

  afterAll(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });

  test('ログインのためのリンクが含まれる', () => {
    return request(app)
      .get('/login')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/<a href="\/auth\/github"/)
      .expect(/<a href="\/auth\/google"/)
      .expect(200);
  });

    test('ログイン完了時はユーザー名が表示される', () => {
    return request(app)
      .get('/')
      .expect(/testuser/)
      .expect(200);
  });
});