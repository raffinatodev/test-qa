import axios from 'axios';
import { authHeader } from '../utils/auth';
import { generateBarcode } from '../utils/generate';

const baseURL = 'http://localhost:3000';

describe('Produtos - CRUD e validações', () => {
  describe('Criação', () => {
    it('deve criar um produto válido', async () => {
      const produto = {
        name: 'Café Gourmet',
        barcode: generateBarcode(),
        price: 19.99,
      };
      const res = await axios.post(
        `${baseURL}/product`,
        produto,
        await authHeader(),
      );
      expect(res.status).toBe(201);
      expect(res.data).toMatchObject(produto);
    });

    it('não deve permitir nome com menos de 3 caracteres', async () => {
      const produtoInvalido = {
        name: 'Oi',
        barcode: generateBarcode(),
        price: 10.0,
      };

      try {
        await axios.post(
          `${baseURL}/product`,
          produtoInvalido,
          await authHeader(),
        );
        fail('Esperado erro de validação, mas requisição foi aceita');
      } catch (err: any) {
        const { status, data } = err.response;
        expect(status).toBe(422);
        expect(data.message.join()).toContain('nome');
      }
    });

    it('não deve permitir preço maior que 999.99', async () => {
      const produtoInvalido = {
        name: 'Ultra Caro',
        barcode: generateBarcode(),
        price: 1000.0,
      };

      try {
        await axios.post(
          `${baseURL}/product`,
          produtoInvalido,
          await authHeader(),
        );
        fail('Esperado erro de validação, mas requisição foi aceita');
      } catch (err: any) {
        const { status, data } = err.response;
        expect(status).toBe(422);
        expect(data.message.join()).toContain('preço');
      }
    });

    it('não deve permitir barcode duplicado', async () => {
      const barcodeDuplicado = generateBarcode();

      await axios.post(
        `${baseURL}/product`,
        {
          name: 'Original',
          barcode: barcodeDuplicado,
          price: 50.0,
        },
        await authHeader(),
      );

      try {
        await axios.post(
          `${baseURL}/product`,
          {
            name: 'Duplicado',
            barcode: barcodeDuplicado,
            price: 40.0,
          },
          await authHeader(),
        );

        fail('Esperado erro de barcode duplicado, mas requisição foi aceita');
      } catch (err: any) {
        const { status, data } = err.response;
        expect([400, 409, 422]).toContain(status);
        expect(data.message).toMatch(/código de barras/i);
      }
    });

    it('não deve permitir barcode com mais de 6 dígitos', async () => {
      const produto = {
        name: 'Longo',
        price: 10,
        barcode: 12345678,
      };

      const res = await axios
        .post(`${baseURL}/product`, produto, await authHeader())
        .catch((err) => err.response);

      expect(res.status).toBe(422);
      expect(res.data.message.join()).toContain('código de barras');
    });
  });

  describe('Leitura', () => {
    it('deve listar produtos', async () => {
      const res = await axios.get(`${baseURL}/product`, await authHeader());
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    });

    it('deve filtrar produto por nome', async () => {
      const produto = {
        name: 'FiltroNome',
        price: 15,
        barcode: generateBarcode(),
      };

      await axios.post(`${baseURL}/product`, produto, await authHeader());

      const { headers } = await authHeader();
      const res = await axios.get(`${baseURL}/product?name=FiltroNome`, {
        headers,
      });

      expect(res.status).toBe(200);
      expect(res.data[0].name).toBe(produto.name);
    });

    it('deve filtrar produto por barcode', async () => {
      const barcode = generateBarcode();
      const produto = {
        name: 'FiltroBarcode',
        price: 15,
        barcode,
      };

      await axios.post(`${baseURL}/product`, produto, await authHeader());

      const { headers } = await authHeader();
      const res = await axios.get(`${baseURL}/product?barcode=${barcode}`, {
        headers,
      });

      expect(res.status).toBe(200);
      expect(res.data[0].barcode).toBe(barcode);
    });
  });

  describe('Atualização', () => {
    it('deve editar um produto', async () => {
      const produto = {
        name: 'Produto Editável',
        barcode: generateBarcode(),
        price: 15.0,
      };

      const novo = await axios.post(
        `${baseURL}/product`,
        produto,
        await authHeader(),
      );

      const editado = await axios.put(
        `${baseURL}/product/${novo.data.id}`,
        {
          name: 'Produto Editado',
          barcode: produto.barcode,
          price: 20.0,
        },
        await authHeader(),
      );

      expect(editado.status).toBe(200);
      expect(editado.data.name).toBe('Produto Editado');
    });

    it('deve falhar ao editar produto inexistente', async () => {
      const res = await axios
        .put(
          `${baseURL}/product/id-invalido`,
          {
            name: 'Não Existe',
            barcode: generateBarcode(),
            price: 10.0,
          },
          await authHeader(),
        )
        .catch((err) => err.response);

      expect(res.status).toBe(404);
      expect(res.data.message).toMatch(/não encontrado/i);
    });
  });

  describe('Remoção', () => {
    it('deve remover um produto', async () => {
      const produto = {
        name: 'Produto Deletável',
        price: 5,
        barcode: generateBarcode(),
      };

      const criado = await axios.post(
        `${baseURL}/product`,
        produto,
        await authHeader(),
      );
      const { headers } = await authHeader();

      const deletado = await axios.delete(
        `${baseURL}/product/${criado.data.id}`,
        {
          headers,
          data: produto,
        },
      );

      expect(deletado.status).toBe(200);
    });

    it('deve falhar ao remover produto inexistente', async () => {
      const produtoFake = {
        name: 'Fake',
        price: 10,
        barcode: 123456,
      };

      const { headers } = await authHeader();

      const res = await axios
        .delete(`${baseURL}/product/id-nao-existe`, {
          headers,
          data: produtoFake,
        })
        .catch((err) => err.response);

      expect(res.status).toBe(404);
      expect(res.data.message).toMatch(/não encontrado/i);
    });
  });

  describe('Segurança', () => {
    it('deve falhar ao acessar produto sem autenticação', async () => {
      const res = await axios
        .get(`${baseURL}/product`)
        .catch((err) => err.response);

      expect(res.status).toBe(401);
      expect(res.data.message).toBeDefined();
    });

    it('deve falhar ao acessar produto com token inválido', async () => {
      const res = await axios
        .get(`${baseURL}/product`, {
          headers: {
            Authorization: 'Bearer invalido123',
          },
        })
        .catch((err) => err.response);

      expect(res.status).toBe(401);
      expect(res.data.message).toBeDefined();
    });
  });
});
