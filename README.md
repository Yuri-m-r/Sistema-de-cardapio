# Sistema Restaurante

Aplicação web para gerenciamento de restaurante: cadastro de produtos (insumos), criação de fichas técnicas com cálculo automático de custo, montagem de cardápios a partir das fichas técnicas e geração automática da requisição de insumos. Desenvolvida com React, TypeScript, Tailwind CSS, Axios e JSON Server.

> Projeto de estudo e portfólio, construído de forma incremental.

## 🚀 Tecnologias

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/) – rotas e layout com `Outlet`
- [Axios](https://axios-http.com/) – instância com `baseURL` configurada por variável de ambiente
- [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup) – formulários e validação
- [JSON Server](https://github.com/typicode/json-server) – API fake para persistência
- [Vitest](https://vitest.dev/) – testes automatizados

## ✨ Funcionalidades

### Produtos

- Listagem em cards, com nome, unidade, categoria e custo formatado em reais
- Busca por nome ou categoria com debounce (300 ms)
- Cadastro e edição em modal, com validação
- Exclusão com confirmação
- Bloqueio da exclusão de produtos que estão sendo usados em uma ficha técnica
- Estados de carregando, erro e lista vazia
- Contagem de produtos encontrados

### Fichas técnicas

- Listagem em cards, com busca por nome ou categoria
- Cadastro e edição em modal, com lista dinâmica de insumos (adicionar e remover)
- Seleção de insumos com campo de busca (autocomplete), sem permitir o mesmo insumo duas vezes na ficha
- Campos: nome, rendimento, unidade de rendimento, categoria, tempo de preparo e modo de preparo
- Datas de criação e de última revisão geradas automaticamente
- Visualização com tabela de insumos, custo por item e **custo total calculado**
- Impressão da ficha técnica (salvar como PDF)
- Exclusão da ficha junto com seus itens
- Bloqueio da exclusão de fichas que estão sendo usadas em um cardápio
- Estados de carregando, erro e lista vazia

### Cardápios

- Listagem em cards, com busca por nome ou dia da semana
- Cadastro e edição em modal: nome, dia da semana e lista de preparos (fichas técnicas) com a quantidade de receitas previstas
- Visualização do cardápio com rendimento por preparo e rendimento total
- Visualização das fichas técnicas de todos os preparos do cardápio
- **Requisição de insumos gerada automaticamente**: soma a quantidade de cada insumo de todas as fichas, multiplicada pelas receitas previstas, agrupando insumos repetidos
- Impressão do cardápio, das fichas técnicas e da requisição (salvar como PDF), com estilos próprios para impressão
- Estados de carregando, erro e lista vazia

### Interface e boas práticas

- Estilização com Tailwind CSS usando classes semânticas centralizadas em `src/index.css` (`@layer components` com `@apply`)
- Componente `Modal` reutilizável, com:
  - fechamento por `Esc` (desabilitado enquanto uma requisição está em andamento)
  - bloqueio de scroll da página
  - retorno do foco ao elemento que abriu o modal
  - atributos de acessibilidade (`role="dialog"`, `aria-modal`, `aria-labelledby`)
- Componente `Combobox` reutilizável, com navegação por teclado e atributos ARIA
- Navegação com destaque da página atual e página 404
- Layout responsivo
- Termo de busca guardado na URL (`?search=`), com debounce
- Hook `useFetch` genérico: respostas atrasadas são ignoradas por *cleanup* de `useEffect`, evitando que uma resposta antiga sobrescreva a tela
- Estado de requisição tipado como união discriminada (`loading` | `success` | `error`)
- Tipos dos campos fixos (unidades, categorias, dias da semana) derivados das constantes com `as const`
- Rollback manual quando a criação de uma ficha ou de um cardápio falha no meio do processo
- Números, moedas e datas formatados no padrão brasileiro (`pt-BR`)

## 🧪 Testes

Os testes automatizados usam o [Vitest](https://vitest.dev/) e cobrem as funções utilitárias, que concentram a lógica do sistema:

| Função | O que é testado |
|---|---|
| `calcTotalCost` | Custo total de uma ficha técnica |
| `groupRequestProducts` | Cálculo e agrupamento dos insumos da requisição |
| `formatCurrency` / `formatNumber` | Formatação em reais e números no padrão brasileiro |
| `normalizeSearch` | Busca sem diferenciar acentos e maiúsculas |

Para executar:

```bash
npm test
```

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/)
- npm

## 🔧 Instalação

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta do projeto:

```bash
cd Sistema-de-Cardapios
```

Instale as dependências:

```bash
npm install
```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

O projeto também possui um arquivo `.env.example` como referência.

## 🗄️ Banco de dados

O projeto usa o JSON Server como API. O arquivo `db.json` está incluído no repositório para que o projeto funcione logo após o clone.

Coleções principais:

| Coleção | Descrição |
|---|---|
| `products` | Produtos/insumos, com unidade, categoria e custo |
| `techDataSheets` | Fichas técnicas |
| `itemDetails` | Itens (insumo + quantidade) de cada ficha técnica |
| `menus` | Cardápios, com nome e dia da semana |
| `menuItems` | Itens (ficha técnica + receitas previstas) de cada cardápio |

Inicie o servidor:

```bash
npm run server
```

A API estará disponível em:

```text
http://localhost:3000
```

## ▶️ Executando o projeto

Em outro terminal:

```bash
npm run dev
```

O Vite exibirá no terminal o endereço para acessar a aplicação.

## 🛠️ Scripts disponíveis

```bash
# Inicia o ambiente de desenvolvimento
npm run dev

# Inicia o JSON Server
npm run server

# Executa os testes (Vitest)
npm test

# Gera a build de produção
npm run build
```

## 🗂️ Estrutura do projeto

```text
src/
├── api/          # Funções de acesso à API (Axios)
├── components/   # Componentes reutilizáveis (Modal, Combobox, navegação, modais de cada módulo)
├── constants/    # Listas fixas (unidades, categorias, dias da semana, links do menu)
├── errors/       # Erros personalizados (ex.: item em uso)
├── hooks/        # Hooks customizados (useFetch, useDebounce, useSearchQuery...)
├── layouts/      # Layout principal com navegação
├── pages/        # Páginas (Home, Cardápios, Fichas técnicas, Produtos, 404)
├── types/        # Tipos TypeScript
├── utils/        # Funções utilitárias (cálculo de custo, formatação, requisição)
│   └── __tests__/  # Testes das funções utilitárias (Vitest)
├── validation/   # Schemas de validação (Yup)
├── App.tsx       # Rotas da aplicação
├── index.css     # Estilos globais e classes semânticas (Tailwind)
└── main.tsx      # Ponto de entrada da aplicação
```

## ⚠️ Limitações conhecidas

- O JSON Server é uma API de simulação: não há autenticação, nem transações.
- A edição de uma ficha técnica ou de um cardápio envia várias requisições em sequência (cabeçalho e itens). Se uma falhar no meio, os dados podem ficar parcialmente atualizados. Com um backend real, isso seria uma única operação atômica.
- A verificação de "item em uso" antes de excluir é feita no front-end. Com um banco relacional, essa garantia virá de chaves estrangeiras.
- Os dados da empresa estão fixos (`companyId: "1"`) enquanto o cadastro/login não é implementado.
- Os testes cobrem apenas as funções utilitárias; componentes e chamadas à API ainda não têm testes.

## 🗺️ Próximos passos

- [x] Busca com autocomplete na seleção de insumos da ficha técnica
- [x] Criação de cardápios a partir das fichas técnicas
- [x] Requisição de insumos gerada automaticamente a partir do cardápio
- [x] Testes automatizados das funções utilitárias
- [ ] Migração da API para o Supabase (PostgreSQL)
- [ ] Cadastro da empresa e login
- [ ] Backend próprio em Node.js

## 📌 Status do projeto

🚧 Em desenvolvimento.

## 👨‍💻 Autor

Yuri Rangel
