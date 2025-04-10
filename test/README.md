# Testes Automatizados com Jest e Supertest

Este diretório contém os testes automatizados da API desenvolvida para o teste técnico QA da Raffinato.

## Pré-requisitos

- Node.js e Yarn instalados na máquina
- A API deve estar rodando localmente no endereço: `http://localhost:3000`

## Setup

- Acesse a pasta test 
- Instale as dependências `yarn install`
- Execute os testes  `yarn test`

## Estrutura

Os testes estão organizados por entidade da API:

- `login.test.ts` testa autenticação e cenários de login
- `product.test.ts` testa o CRUD de produtos, incluindo casos inválidos

## Observações

- Os testes utilizam autenticação via **Bearer Token**. O token é gerado automaticamente durante a execução via o endpoint /user/login.
- Os testes cobrem cenários de sucesso e erro, incluindo:
  - Dados inválidos ou ausentes
  - Requisições sem token de autenticação
  - Tentativas de criar produtos duplicados
- Os produtos criados durante os testes são automaticamente deletados ao final da execução, isso foi configurado para facilitar os testes contínuos durante o desenvolvimento.
- Utilizado o GitHub Actions para automatizar o processo de integração contínua (CI) e execução de testes automatizados. A configuração do workflow permite que os testes sejam executados automaticamente em cada push ou pull request na branch `development`.
