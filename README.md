# Controle de Viagem

Controle pessoal de despesas de viagem, feito em Next.js. Tela inicial com
acesso rápido a **Lançamentos** (cadastro dos gastos) e **Relatório**
(planilha com o total).

## Funcionalidades

- **Lançamentos**: adicionar, editar e excluir gastos (empresa, tipo, motivo
  e valor).
- **Relatório**: tabela com todos os lançamentos, total geral e total por
  tipo, com opção de impressão/exportação em PDF.
- Dados salvos localmente no navegador (`localStorage`) — não é necessário
  backend ou login.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy

Projeto pronto para deploy na [Vercel](https://vercel.com/new): basta
importar este repositório.
