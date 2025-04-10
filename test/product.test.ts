import request from 'supertest';

let token: string;
let ProductId2: string;
const apiUrl = 'http://localhost:3000';

beforeAll(async () => {
  const res = await request(apiUrl).post('/user/login').send({
    mail: 'qa@raffinato.com',
    password: 'test-qa',
  });
  token = res.body.token;
});

describe('Testes da API de Produto', () => {

  let productId: string;

  it('Cadastrar produto', async () => {
    const res = await request(apiUrl)
      .post('/product')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Coca Cola KS', price: 5, barcode: 123456 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    productId = res.body.id;
  });

  it('Buscar produtos', async () => {
    const res = await request(apiUrl)
      .get('/product')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Buscar produto pelo ID', async () => {
    const res = await request(apiUrl)
      .get(`/product/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(productId);
  });

  it('Editar preço produto', async () => {
    const res = await request(apiUrl)
      .put(`/product/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Coca Cola KS', price: 7, barcode: 123456 });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(7);
  });

  it('Deletar o produto criado', async () => {
    const res = await request(apiUrl)
      .delete(`/product/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

    describe('Cenários inválidos', () => {

        it('Deletar produto inexistente', async () => {
            const res = await request(apiUrl)
            .delete(`/product/${productId}`)
            .set('Authorization', `Bearer ${token}`);
        
            expect(res.status).toBe(404);
            expect(res.body.message).toContain('Produto não encontrado');
          });
        
          it('Cadastrar produto sem body', async () => {
            const res = await request(apiUrl)
            .post('/product')
            .set('Authorization', `Bearer ${token}`);
        
            expect(res.status).toBe(422);
            expect(Array.isArray(res.body.message)).toBe(true);
          });

          it('Cadastrar produto sem nome', async () => {
            const res = await request(apiUrl)
            .post('/product')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: '', price: 5, barcode: 123456 });

            expect(res.status).toBe(422);
            expect(res.body.message).toContain('O nome deve conter de 3 a 20 caracteres');
          });

          it('Cadastrar produto sem preço', async () => {
            const res = await request(apiUrl)
            .post('/product')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Coca Cola KS',  barcode: 123456 });

            expect(res.status).toBe(422);
            expect(res.body.message).toContain('Preço inválido');
          });

          it('Cadastrar produto sem código de barras', async () => {
            const res = await request(apiUrl)
            .post('/product')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Coca Cola KS', price: 5 });

            expect(res.status).toBe(422);
            expect(res.body.message).toContain('Código de barra inválido');
          });

          it('Cadastrar produtos com barcode duplicado', async () => {
            const res = await request(apiUrl)
              .post('/product')
              .set('Authorization', `Bearer ${token}`)
              .send({ name: 'Coca Cola Zero', price: 5, barcode: 123456 });

              ProductId2 = res.body.id;
          
            const res2 = await request(apiUrl)
              .post('/product')
              .set('Authorization', `Bearer ${token}`)
              .send({ name: 'Guarana Zero', price: 5, barcode: 123456 });
          
            expect(res2.status).toBe(400);
            expect(res2.body.message).toContain('Já existe um produto com código de barras');
          });
        
          it('Cadastrar produto sem token', async () => {
            const res = await request(apiUrl)
            .post('/product')
            .send({ name: 'Coca Lata 350ML', price: 5, barcode: 123456 });
        
            expect(res.status).toBe(401);
          });
        
          it('Buscar produtos sem token', async () => {
            const res = await request(apiUrl)
            .get('/product')
            
            expect(res.status).toBe(401);
          });

          it('Editar produto sem token', async () => {
            const res = await request(apiUrl)
            .put(`/product/${productId}`)
            .set('Authorization', `Bearer tokeninvalido`)
            .send({ nome: 'Teste', price: 5, barcode: 123456});

            expect(res.status).toBe(401);
          });

          it('Buscar produto com ID inválido', async () => {
            const res = await request(apiUrl)
            .get('/product/idinvalido')
            .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body.message).toContain('Produto não encontrado');
          });

          it('Editar produto com preço inválido', async () => {
            const res = await request(apiUrl)
              .put(`/product/${productId}`)
              .set('Authorization', `Bearer ${token}`)
              .send({ name: 'Coca Cola KS', price: 0, barcode: 123456 });
          
            expect(res.status).toBe(422);
            expect(res.body.message).toContain('O preço não poder ter valor menor que 0.01');
          });

          it('Editar produto com nome inválido', async () => {
            const res = await request(apiUrl)
            .put(`/product/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: "a", price: 1, barcode: 123456});

            expect(res.status).toBe(422);
            expect(res.body.message).toContain('O nome deve conter de 3 a 20 caracteres');
          });
          
    });

});

afterAll(async () => {
  if (ProductId2) {
    await request(apiUrl)
      .delete(`/product/${ProductId2}`)
      .set('Authorization', `Bearer ${token}`);
  }
});