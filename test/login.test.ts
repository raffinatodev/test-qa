import request from 'supertest';

const apiUrl = 'http://localhost:3000';

describe('Login', () => {
  it('Login com credenciais válidas', async () => {
    const res = await request(apiUrl)
      .post('/user/login')
      .send({ mail: 'qa@raffinato.com', password: 'test-qa' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('Login com senha inválida', async () => {
    const res = await request(apiUrl)
      .post('/user/login')
      .send({ mail: 'qa@raffinato.com', password: 'test' });

    expect(res.status).toBe(401);
  });

  it('Login com email inválido', async () => {
    const res = await request(apiUrl)
    .post('/user/login')
    .send({ mail: 'errado', password: '123456' });

    expect(res.status).toBe(422);
  });

  it('Login sem body', async () => {
    const res = await request(apiUrl)
    .post('/user/login');

    expect(res.status).toBe(422);
  })
});
