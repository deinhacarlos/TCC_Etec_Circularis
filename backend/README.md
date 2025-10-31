# API Circularis - Sistema de Troca de Materiais Sustentáveis

API Backend desenvolvida para o TCC (Trabalho de Conclusão de Curso) do projeto Circularis, um sistema focado em troca sustentável de materiais entre usuários.

## 📋 Descrição

O Circularis é uma plataforma que permite aos usuários cadastrarem materiais que desejam trocar ou doar, facilitando a economia circular e a sustentabilidade. A API oferece funcionalidades completas para gerenciamento de usuários, materiais, trocas, denúncias, recomendações, notificações e chat em tempo real.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Ambiente de execução JavaScript
- **Express.js** - Framework web para Node.js
- **MySQL** - Banco de dados relacional
- **JWT (JSON Web Tokens)** - Autenticação e autorização
- **Socket.IO** - Comunicação em tempo real para chat
- **bcrypt** - Criptografia de senhas
- **dotenv** - Gerenciamento de variáveis de ambiente
- **CORS** - Controle de acesso entre origens

## 📁 Estrutura do Projeto

```
circularis-api/
├── src/
│   ├── config/
│   │   ├── db.js                    # Configuração do banco de dados
│   │   └── socketHandler.js         # Configuração do Socket.IO
│   ├── controllers/
│   │   ├── usuarioController.js     # Lógica de controle de usuários
│   │   ├── materialController.js    # Lógica de controle de materiais
│   │   ├── trocaController.js       # Lógica de controle de trocas
│   │   ├── denunciaController.js    # Lógica de controle de denúncias
│   │   ├── recomendacaoController.js # Lógica de controle de recomendações
│   │   ├── notificacaoController.js # Lógica de controle de notificações
│   │   ├── chatController.js        # Lógica de controle de chats
│   │   └── mensagemController.js    # Lógica de controle de mensagens
│   ├── services/
│   │   ├── usuarioService.js        # Operações de banco de dados - usuários
│   │   ├── materialService.js       # Operações de banco de dados - materiais
│   │   ├── trocaService.js          # Operações de banco de dados - trocas
│   │   ├── denunciaService.js       # Operações de banco de dados - denúncias
│   │   ├── recomendacaoService.js   # Operações de banco de dados - recomendações
│   │   ├── notificacaoService.js    # Operações de banco de dados - notificações
│   │   ├── chatService.js           # Operações de banco de dados - chats
│   │   └── mensagemService.js       # Operações de banco de dados - mensagens
│   ├── routes/
│   │   ├── usuarioRoutes.js         # Rotas de usuários
│   │   ├── materialRoutes.js        # Rotas de materiais
│   │   ├── trocaRoutes.js           # Rotas de trocas
│   │   ├── denunciaRoutes.js        # Rotas de denúncias
│   │   ├── recomendacaoRoutes.js    # Rotas de recomendações
│   │   ├── notificacaoRoutes.js     # Rotas de notificações
│   │   ├── chatRoutes.js            # Rotas de chats
│   │   └── mensagemRoutes.js        # Rotas de mensagens
│   ├── middlewares/
│   │   └── authMiddleware.js        # Middleware de autenticação JWT
│   └── app.js                       # Configuração do Express
├── server.js                        # Ponto de entrada da aplicação
├── package.json                     # Dependências e scripts
├── .env                            # Variáveis de ambiente (não versionado)
├── .env.example                    # Exemplo de variáveis de ambiente
└── README.md                       # Documentação do projeto
```

## ⚙️ Instalação e Configuração

### Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)
- npm ou yarn

### Passo a Passo

1. **Clone o repositório ou extraia os arquivos do projeto**

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
   - Crie um banco de dados MySQL chamado `Circularis`
   - Execute o script SQL fornecido em `database.sql` para criar as tabelas

4. **Configure as variáveis de ambiente**
   - Copie o arquivo `.env.example` para `.env`
   - Preencha as variáveis com suas configurações:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=Circularis
DB_PORT=3306
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=7d
```

5. **Inicie o servidor**

**Modo de desenvolvimento (com nodemon):**
```bash
npm run dev
```

**Modo de produção:**
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📚 Documentação da API

### Autenticação

A maioria dos endpoints requer autenticação via JWT. Após fazer login, inclua o token no header das requisições:

```
Authorization: Bearer seu_token_jwt_aqui
```

### Endpoints Disponíveis

#### **Usuários** (`/api/usuarios`)
- `POST /api/usuarios/cadastro` - Cadastrar novo usuário
- `POST /api/usuarios/login` - Fazer login
- `GET /api/usuarios/:id` - Buscar usuário por ID (autenticado)
- `GET /api/usuarios` - Listar usuários (autenticado)
- `PUT /api/usuarios/:id` - Atualizar usuário (autenticado)
- `DELETE /api/usuarios/:id` - Excluir usuário (autenticado)

#### **Materiais** (`/api/materiais`)
- `POST /api/materiais` - Cadastrar material (autenticado)
- `GET /api/materiais/:id` - Buscar material por ID (autenticado)
- `GET /api/materiais` - Listar materiais com filtros (autenticado)
- `PUT /api/materiais/:id` - Atualizar material (autenticado)
- `PATCH /api/materiais/:id/disponibilidade` - Alterar disponibilidade (autenticado)
- `DELETE /api/materiais/:id` - Excluir material (autenticado)

#### **Trocas** (`/api/trocas`)
- `POST /api/trocas` - Criar solicitação de troca (autenticado)
- `GET /api/trocas/:id` - Buscar troca por ID (autenticado)
- `GET /api/trocas` - Listar trocas com filtros (autenticado)
- `PUT /api/trocas/:id` - Atualizar troca (autenticado)
- `PATCH /api/trocas/:id/concluir` - Concluir troca (autenticado)
- `DELETE /api/trocas/:id` - Cancelar troca (autenticado)

#### **Denúncias** (`/api/denuncias`)
- `POST /api/denuncias` - Criar denúncia (autenticado)
- `GET /api/denuncias/:id` - Buscar denúncia por ID (autenticado)
- `GET /api/denuncias` - Listar denúncias com filtros (autenticado)
- `PUT /api/denuncias/:id` - Atualizar denúncia (autenticado)
- `PATCH /api/denuncias/:id/resolver` - Resolver denúncia (autenticado)
- `DELETE /api/denuncias/:id` - Excluir denúncia (autenticado)

#### **Recomendações** (`/api/recomendacoes`)
- `POST /api/recomendacoes` - Criar recomendação (autenticado)
- `POST /api/recomendacoes/gerar/:usuario_id` - Gerar recomendações automáticas (autenticado)
- `GET /api/recomendacoes/:id` - Buscar recomendação por ID (autenticado)
- `GET /api/recomendacoes` - Listar recomendações com filtros (autenticado)
- `PUT /api/recomendacoes/:id` - Atualizar recomendação (autenticado)
- `DELETE /api/recomendacoes/:id` - Excluir recomendação (autenticado)

#### **Notificações** (`/api/notificacoes`)
- `POST /api/notificacoes` - Criar notificação (autenticado)
- `GET /api/notificacoes/:id` - Buscar notificação por ID (autenticado)
- `GET /api/notificacoes` - Listar notificações com filtros (autenticado)
- `GET /api/notificacoes/usuario/:usuario_id/nao-lidas` - Contar não lidas (autenticado)
- `PUT /api/notificacoes/:id` - Atualizar notificação (autenticado)
- `PATCH /api/notificacoes/:id/lida` - Marcar como lida (autenticado)
- `PATCH /api/notificacoes/usuario/:usuario_id/marcar-todas-lidas` - Marcar todas como lidas (autenticado)
- `DELETE /api/notificacoes/:id` - Excluir notificação (autenticado)

#### **Chats** (`/api/chats`)
- `POST /api/chats` - Criar chat (autenticado)
- `GET /api/chats/:id` - Buscar chat por ID (autenticado)
- `GET /api/chats` - Listar chats (autenticado)
- `PUT /api/chats/:id` - Atualizar chat (autenticado)
- `PATCH /api/chats/:id/desativar` - Desativar chat (autenticado)
- `DELETE /api/chats/:id` - Excluir chat (autenticado)

#### **Mensagens** (`/api/mensagens`)
- `POST /api/mensagens` - Enviar mensagem (autenticado)
- `GET /api/mensagens/:id` - Buscar mensagem por ID (autenticado)
- `GET /api/mensagens` - Listar mensagens (autenticado)
- `GET /api/mensagens/chat/:chat_id/usuario/:usuario_id/nao-lidas` - Contar não lidas (autenticado)
- `PATCH /api/mensagens/:id/lida` - Marcar como lida (autenticado)
- `PATCH /api/mensagens/chat/:chat_id/marcar-todas-lidas` - Marcar todas como lidas (autenticado)
- `DELETE /api/mensagens/:id` - Excluir mensagem (autenticado)

### Exemplos de Requisições

#### Cadastrar Usuário
```bash
POST /api/usuarios/cadastro
Content-Type: application/json

{
  "Nome_Completo": "João Silva",
  "Email": "joao@example.com",
  "Senha": "senha123",
  "Telefone": "(11) 98765-4321",
  "DataNascimento": "1990-01-15",
  "Endereco": "Rua Exemplo, 123",
  "Tipo_Usuario": "comum"
}
```

#### Login
```bash
POST /api/usuarios/login
Content-Type: application/json

{
  "Email": "joao@example.com",
  "Senha": "senha123"
}
```

#### Cadastrar Material
```bash
POST /api/materiais
Authorization: Bearer seu_token_jwt
Content-Type: application/json

{
  "Titulo": "Cadeira de Escritório",
  "Descricao": "Cadeira em bom estado, apenas com pequenos desgastes",
  "Tipo_Material": "Móvel",
  "Estado_Conservacao": "Bom",
  "Categoria": "Escritório",
  "Objetivo": "troca",
  "Localizacao": "São Paulo - SP",
  "Id_Usuario_FK": 1
}
```

#### Solicitar Troca
```bash
POST /api/trocas
Authorization: Bearer seu_token_jwt
Content-Type: application/json

{
  "Id_Material_FK": 1,
  "Id_Usuario_Solicitante_FK": 2,
  "Id_Usuario_Doador_FK": 1,
  "Observacoes": "Gostaria muito de ter essa cadeira para meu home office"
}
```

## 🔌 Socket.IO - Chat em Tempo Real

### Conexão

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'seu_token_jwt'
  }
});
```

### Eventos Disponíveis

#### Eventos do Cliente para o Servidor

- **`join_chat`** - Entrar em uma sala de chat
```javascript
socket.emit('join_chat', chatId);
```

- **`leave_chat`** - Sair de uma sala de chat
```javascript
socket.emit('leave_chat', chatId);
```

- **`send_message`** - Enviar mensagem
```javascript
socket.emit('send_message', {
  chatId: 1,
  mensagem: {
    Id_Mensagem: 123,
    Conteudo: "Olá!",
    Id_Usuario_Rementente_FK: 1,
    Nome_Remetente: "João"
  }
});
```

- **`typing`** - Notificar que está digitando
```javascript
socket.emit('typing', {
  chatId: 1,
  usuarioNome: "João"
});
```

- **`stop_typing`** - Notificar que parou de digitar
```javascript
socket.emit('stop_typing', { chatId: 1 });
```

#### Eventos do Servidor para o Cliente

- **`receive_message`** - Receber mensagem
```javascript
socket.on('receive_message', (data) => {
  console.log('Nova mensagem:', data);
});
```

- **`user_typing`** - Usuário está digitando
```javascript
socket.on('user_typing', (data) => {
  console.log(`${data.usuarioNome} está digitando...`);
});
```

- **`user_stop_typing`** - Usuário parou de digitar
```javascript
socket.on('user_stop_typing', (data) => {
  console.log('Parou de digitar');
});
```

- **`new_notification`** - Nova notificação
```javascript
socket.on('new_notification', (notificacao) => {
  console.log('Nova notificação:', notificacao);
});
```

## 🛡️ Segurança

- Senhas são criptografadas usando bcrypt antes de serem armazenadas
- Autenticação via JWT com expiração configurável
- Middleware de autenticação protege rotas sensíveis
- Validação de dados de entrada em todos os endpoints
- Verificação de permissões para operações críticas

## 🧪 Testes

Para testar a API, você pode usar ferramentas como:
- **Postman** - Interface gráfica para testar APIs
- **Insomnia** - Alternativa ao Postman
- **cURL** - Linha de comando
- **Thunder Client** - Extensão do VS Code

## 📝 Observações Importantes

1. **Banco de Dados**: Certifique-se de que o MySQL está rodando e o banco `Circularis` foi criado com todas as tabelas
2. **Variáveis de Ambiente**: Nunca commite o arquivo `.env` com dados sensíveis
3. **JWT Secret**: Use uma chave secreta forte e única em produção
4. **CORS**: Em produção, configure o CORS para aceitar apenas domínios específicos
5. **Socket.IO**: Configure origens permitidas em produção no arquivo `socketHandler.js`

## 🤝 Contribuindo

Este é um projeto acadêmico (TCC). Para contribuições ou sugestões, entre em contato com os desenvolvedores.

## 📄 Licença

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC).

## 👥 Autores

Projeto Circularis - TCC

---

**Versão:** 1.0.0  
**Data:** 2025
