import axios from 'axios';

describe('Login', () => {
  const baseURL = 'http://localhost:3000';
  const endpoint = `${baseURL}/user/login`;
  it('1- deve autenticar com sucesso com credenciais válidas', async () => {
    const response = await axios.post(endpoint, {
      mail: 'qa@raffinato.com',
      password: 'test-qa',
    });
    expect([200, 201]).toContain(response.status);
    expect(response.data).toHaveProperty('token');
    expect(response.data.user).toHaveProperty('mail', 'qa@raffinato.com');
  });
  it('2- deve falhar com senha incorreta', async () => {
    const res = await axios
      .post(endpoint, {
        mail: 'qa@raffinato.com',
        password: 'senha-errada',
      })
      .catch((err) => err.response);
    expect(res.status).toBe(401);
    expect(res.data.message).toMatch(/usuário ou senha inválido/i);
  });
  it('3- deve falhar com e-mail inválido (sem @)', async () => {
    const res = await axios
      .post(endpoint, {
        mail: 'invalido.com',
        password: 'test-qa',
      })
      .catch((err) => err.response);
    expect(res.status).toBe(422); 
    expect(res.data.message.join()).toContain('E-mail inválido');
  });
  it('4- deve falhar com e-mail vazio', async () => {
    const res = await axios
      .post(endpoint, {
        mail: '',
        password: 'test-qa',
      })
      .catch((err) => err.response);
    expect(res.status).toBe(422); 
    expect(res.data.message.join()).toContain('E-mail inválido');
  });
  it('5- deve falhar com senha vazia', async () => {
    const res = await axios
      .post(endpoint, {
        mail: 'qa@raffinato.com',
        password: '',
      })
      .catch((err) => err.response);
    expect(res.status).toBe(422); 
    expect(res.data.message).toContain('Preencha o campo senha');
  });
  it('6- deve falhar com senha em tipo incorreto (booleano)', async () => {
    const res = await axios
      .post(endpoint, {
        mail: 'qa@raffinato.com',
        password: true,
      })
      .catch((err) => err.response);

    expect(res.status).toBe(422); 
    expect(res.data.message.join()).toContain('Senha deve ser uma string');
  });
  it('7- deve falhar ao omitir o campo mail', async () => {
    const res = await axios
      .post(endpoint, {
        password: 'test-qa',
      })
      .catch((err) => err.response);
    expect(res.status).toBe(422); 
    expect(res.data.message.join()).toContain('E-mail inválido');
  });
  it('8- deve falhar ao omitir o campo password', async () => {
    const res = await axios
      .post(endpoint, {
        mail: 'qa@raffinato.com',
      })
      .catch((err) => err.response);
    expect(res.status).toBe(422); 
    expect(res.data.message).toContain('Preencha o campo senha');
  });
  it('9- deve falhar ao enviar payload vazio', async () => {
    const res = await axios.post(endpoint, {}).catch((err) => err.response);
    expect(res.status).toBe(422);
    expect(res.data.message).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/E-mail inválido/),
        expect.stringMatching(/Preencha o campo senha/),
      ]),
    );
  });
});
