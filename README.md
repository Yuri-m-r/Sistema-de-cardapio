# Sistema Restaurante

Aplicação web para gerenciamento de restaurante: cadastro de produtos (insumos) e criação de fichas técnicas com cálculo automático de custo. Desenvolvida com React, TypeScript, Tailwind CSS, Axios e JSON Server.

> Projeto de estudo e portfólio, construído de forma incremental.

## 🚀 Tecnologias

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/) – rotas e layout com `Outlet`
- [Axios](https://axios-http.com/) – instância com `baseURL` configurada por variável de ambiente
- [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup) – formulários e validação
- [JSON Server](https://github.com/typicode/json-server) – API fake para persistência

## ✨ Funcionalidades

### Produtos

- Listagem em cards, com nome, unidade e custo formatado em reais
- Busca por nome ou categoria com debounce (300 ms)
- Cadastro e edição em modal, com validação
- Exclusão com confirmação
- Bloqueio da exclusão de produtos que estão sendo usados em uma ficha técnica
- Estados de carregando, erro e lista vazia
- Contagem de produtos encontrados
- Categoria por produto 

### Fichas técnicas

- Listagem em cards, com busca por nome
- Cadastro e edição em modal, com lista dinâmica de insumos (adicionar e remover)
- Campos: nome, rendimento, unidade de rendimento, categoria, tempo de preparo e modo de preparo
- Datas de criação e de última revisão geradas automaticamente
- Visualização com tabela de insumos, custo por item e **custo total calculado**
- Exclusão da ficha junto com seus itens
- Estados de carregando, erro e lista vazia
- Filtro por categoria, combinável com a busca por nome
  
### Interface e boas práticas

- Estilização com Tailwind CSS usando classes semânticas centralizadas em `src/index.css` (`@layer components` com `@apply`)
- Componente `Modal` reutilizável, com:
  - fechamento por `Esc`
  - bloqueio de scroll da página
  - retorno do foco ao elemento que abriu o modal
  - atributos de acessibilidade (`role="dialog"`, `aria-modal`, `aria-labelledby`)
- Navegação com destaque da página atual
- Layout responsivo
- Requisições de busca canceladas por *cleanup* de `useEffect`, evitando resposta atrasada sobrescrever a tela
- Estado de requisição tipado como união discriminada (`loading` | `success` | `error`)

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
| `products` | Produtos/insumos, com unidade e custo |
| `techDataSheets` | Fichas técnicas |
| `techDataSheetItems` | Itens (insumo + quantidade) de cada ficha técnica |

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

# Gera a build de produção
npm run build
```

## 🗂️ Estrutura do projeto

```text
src/
├── api/          # Funções de acesso à API (Axios)
├── components/   # Componentes reutilizáveis (Modal, navegação, modais de cada módulo)
├── constants/    # Listas fixas (unidades, categorias, links do menu)
├── hooks/        # Hooks customizados
├── layouts/      # Layout personalizado
├── pages/        # Páginas (Produtos, Fichas técnicas)
├── types/        # Tipos e interfaces TypeScript
├── validation/   # Schemas de validação (Yup)
├── App.tsx       # App.tsx 
├── index.css     # Estilos globais e classes semânticas (Tailwind)
└── Main.tsx      # Main.tsx
```

## ⚠️ Limitações conhecidas

- O JSON Server é uma API de simulação: não há autenticação, nem transações.
- A edição de uma ficha técnica envia várias requisições em sequência (ficha e itens). Se uma falhar no meio, os dados podem ficar parcialmente atualizados. Com um backend real, isso seria uma única operação atômica.
- Os dados da empresa estão fixos (`companyId: "1"`) enquanto o cadastro/login não é implementado.

## 🗺️ Próximos passos

- [ ] Busca com autocomplete na seleção de insumos da ficha técnica
- [ ] Cadastro da empresa e login
- [ ] Criação de cardápios a partir das fichas técnicas
- [ ] Requisição de compras gerada automaticamente a partir do cardápio
- [ ] Testes automatizados
- [ ] Backend real e banco de dados

## 📌 Status do projeto

🚧 Em desenvolvimento.

## 👨‍💻 Autor

Yuri Rangel
