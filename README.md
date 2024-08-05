# Raffinato - QA Test
___


## Api

O projeto contém uma api simples com um login, um CRUD de produtos e uma documentação 
da api em swagger no endpoint: http://localhost:3000/doc, a api usa um banco de dados em memoria
toda vez que a aplicação é iniciada a base de dados inicia vazia.

### Login

- Usuário e senha para acessar a api são fixo 
  - usuário: `qa@raffinato.com`
  - senha: `test-qa`

### Produtos

- O cadastro de produtos tem a seguinte regra para os seus campos:
  - **nome:**
    - campo de texto
    - obrigatório 
    - com uma quantidade caracteres de 3 a 20
  - **barcode:**
    - campo númerico inteiro
    - obrigatório
    - campo deve ser unico
    - com o valor de 1 até 999999
  - **price:**
    - campo númerico decimal
    - obrigatório
    - máximo de duas casas decimais
    - com o valor de 0,01 até 999.99 

### Setup da api

- Ter instalado a versão do node 20 ou superior
- Acesse o diretório api
  - Caso use o NVM([Node Version Manager](https://github.com/nvm-sh/nvm)) rode o comando `nvm use` dentro do diretório api
- Instalar as dependências rodar o comando `yarn install` 
- Subir a aplicação rodar o comando `yarn start`

## Requerimentos
 
- Criar um fork publico do projeto para sua conta no github
- Criar um branch com o nome development
- Criar um projeto em jest isolado do projeto da api em um diretório com o nome de test
- Fazer commits conforme o progresso de inclussão dos teste
- Criar um arquivo README.md detro do diretório criado para o teste documentando em como fazer o setup e rodar os testes.
- Oraganizar o projeto da forma que achar melhor


### Não obrigatórios

- Usar typescript
- Usar uma ferramenta de lint / code style
- Configurar para rodar os testes via github actions



## Requisitos para serem testados

- **Login**
  - Deve ser implementado um teste para acessar com as credêcias validas
  - Deve ser implementado um teste de tentativa de acessar com credêcias inválidas 
- **Produtos**
  - Deve ser implementado um ou mais testes para criar um novo produto
  - Deve ser implementado um ou mais testes para editar um produto
  - Deve ser implementado um ou mais testes para remover um produto
  - Deve ser implementado um ou mais testes para listar produtos

## Entrega

- Abrir um pull request para a branch main
- Enviar por e-mail avisando que finalizou o teste com o link do repositório

    
A descrição desse teste é um vaga em alguns aspectos de forma intencional, 
sinta-se à vontade para pedir ajuda ou tirar duvidas caso ache necessário.
