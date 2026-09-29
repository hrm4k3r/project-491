# Controle de Viagem

Controle pessoal de despesas de viagem, feito em Next.js. Tela inicial com
acesso rápido a **Lançamentos** (cadastro dos gastos) e **Relatório**
(planilha com o total).

## Funcionalidades

- **Lançamentos**: adicionar, editar e excluir gastos (empresa, tipo, motivo
  e valor).
- **Relatório**: tabela com todos os lançamentos, total geral e total por
  tipo, com opção de impressão/exportação em PDF.
- Dados salvos em um banco **Postgres** via API routes (`app/api/lancamentos`)
  — persistem entre dispositivos e deploys, não dependem do navegador.

## Banco de dados

O projeto usa Postgres através da variável de ambiente `DATABASE_URL`. A
tabela `lancamentos` é criada automaticamente na primeira requisição (não
precisa rodar migração manual).

### Na Vercel (recomendado)

1. No painel do projeto na Vercel: **Storage → Create Database → Postgres**
   (ou **Neon**, que é o provedor por trás do Vercel Postgres hoje).
2. A Vercel injeta as variáveis (`DATABASE_URL`/`POSTGRES_URL`) automaticamente
   no deploy — nenhuma configuração extra é necessária.

### Localmente

1. Crie um banco Postgres (local ou um projeto gratuito no
   [Neon](https://neon.tech)).
2. Copie `.env.example` para `.env.local` e preencha `DATABASE_URL` com a
   connection string do banco.
   - Se estiver usando o banco da Vercel, rode `vercel env pull .env.local`
     para puxar a variável automaticamente.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy

Projeto pronto para deploy na [Vercel](https://vercel.com/new): basta
importar este repositório e configurar o banco conforme acima.
