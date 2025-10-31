# Documentação Detalhada dos Endpoints da API Circularis

## Índice
1. [Usuários](#usuários)
2. [Materiais](#materiais)
3. [Trocas](#trocas)
4. [Denúncias](#denúncias)
5. [Recomendações](#recomendações)
6. [Notificações](#notificações)
7. [Chats](#chats)
8. [Mensagens](#mensagens)

---

## Usuários

### Cadastrar Usuário
**Endpoint:** `POST /api/usuarios/cadastro`  
**Autenticação:** Não requerida  
**Descrição:** Registra um novo usuário no sistema

**Body:**
```json
{
  "Nome_Completo": "João Silva",
  "Email": "joao@example.com",
  "Senha": "senha123",
  "Telefone": "(11) 98765-4321",
  "DataNascimento": "1990-01-15",
  "Endereco": "Rua Exemplo, 123, São Paulo - SP",
  "Tipo_Usuario": "comum"
}
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Usuário cadastrado com sucesso!",
  "usuarioId": 1
}
```

---

### Login
**Endpoint:** `POST /api/usuarios/login`  
**Autenticação:** Não requerida  
**Descrição:** Autentica um usuário e retorna um token JWT

**Body:**
```json
{
  "Email": "joao@example.com",
  "Senha": "senha123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Login realizado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "Id_Usuario": 1,
    "Nome_Completo": "João Silva",
    "Email": "joao@example.com",
    "Tipo_Usuario": "comum"
  }
}
```

---

### 🆕 Esqueci Minha Senha
**Endpoint:** `POST /api/usuarios/esqueci-senha`  
**Autenticação:** Não requerida  
**Descrição:** Solicita recuperação de senha via email

**Body:**
```json
{
  "email": "joao@example.com"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Se o email estiver cadastrado, você receberá instruções para redefinir sua senha."
}
```

**Observações:**
- Por segurança, sempre retorna sucesso mesmo se o email não existir
- Um email com link de recuperação será enviado caso o email esteja cadastrado
- O token de recuperação tem validade de 1 hora

---

### 🆕 Validar Token de Recuperação
**Endpoint:** `GET /api/usuarios/validar-token/:token`  
**Autenticação:** Não requerida  
**Descrição:** Valida se um token de recuperação de senha ainda é válido

**Parâmetros de URL:**
- `:token` - Token recebido por email

**Resposta de Sucesso (200):**
```json
{
  "valido": true,
  "message": "Token válido."
}
```

**Resposta de Erro (400):**
```json
{
  "valido": false,
  "message": "Token inválido ou expirado."
}
```

---

### 🆕 Redefinir Senha
**Endpoint:** `POST /api/usuarios/redefinir-senha/:token`  
**Autenticação:** Não requerida  
**Descrição:** Redefine a senha do usuário usando o token recebido por email

**Parâmetros de URL:**
- `:token` - Token recebido por email

**Body:**
```json
{
  "novaSenha": "novaSenha123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Senha redefinida com sucesso!"
}
```

**Resposta de Erro (400):**
```json
{
  "message": "Token inválido ou expirado. Solicite uma nova recuperação de senha."
}
```

---

### 🆕 Alterar Senha (Usuário Autenticado)
**Endpoint:** `PATCH /api/usuarios/:id/senha`  
**Autenticação:** Requerida (Bearer Token)  
**Descrição:** Permite que um usuário autenticado altere sua própria senha

**Parâmetros de URL:**
- `:id` - ID do usuário

**Body:**
```json
{
  "senhaAtual": "senhaAntiga123",
  "novaSenha": "senhaNova456"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Senha atualizada com sucesso!"
}
```

**Respostas de Erro:**
```json
// 400 - Senha atual incorreta
{
  "message": "Senha atual incorreta."
}

// 400 - Senha muito fraca
{
  "message": "A nova senha deve ter pelo menos 6 caracteres."
}

// 404 - Usuário não encontrado
{
  "message": "Usuário não encontrado."
}
```

---

### Buscar Usuário por ID
**Endpoint:** `GET /api/usuarios/:id`  
**Autenticação:** Requerida (Bearer Token)  
**Descrição:** Retorna os dados de um usuário específico

**Resposta de Sucesso (200):**
```json
{
  "Id_Usuario": 1,
  "Nome_Completo": "João Silva",
  "Email": "joao@example.com",
  "Telefone": "(11) 98765-4321",
  "DataNascimento": "1990-01-15",
  "Endereco": "Rua Exemplo, 123",
  "FotoPerfil": null,
  "Tipo_Usuario": "comum",
  "Status": 1,
  "DataCadastro": "2025-01-15T10:30:00.000Z",
  "PontosRanking": 0
}
```

---

### Listar Usuários
**Endpoint:** `GET /api/usuarios`  
**Autenticação:** Requerida  
**Descrição:** Lista todos os usuários com filtros opcionais

**Query Parameters:**
- `tipo_usuario` (opcional): Filtrar por tipo de usuário
- `status` (opcional): Filtrar por status (true/false)
- `limite` (opcional): Número máximo de resultados
- `offset` (opcional): Deslocamento para paginação

**Exemplo:** `GET /api/usuarios?tipo_usuario=comum&limite=10`

---

### Atualizar Usuário
**Endpoint:** `PUT /api/usuarios/:id`  
**Autenticação:** Requerida  
**Descrição:** Atualiza os dados de um usuário

**Body (todos os campos são opcionais):**
```json
{
  "Nome_Completo": "João Silva Santos",
  "Telefone": "(11) 91234-5678",
  "Endereco": "Nova Rua, 456",
  "FotoPerfil": "url_da_foto"
}
```

---

### Excluir Usuário
**Endpoint:** `DELETE /api/usuarios/:id`  
**Autenticação:** Requerida  
**Descrição:** Remove um usuário do sistema

---

## Materiais

### Cadastrar Material
**Endpoint:** `POST /api/materiais`  
**Autenticação:** Requerida  
**Descrição:** Cadastra um novo material no sistema

**Body:**
```json
{
  "Titulo": "Cadeira de Escritório",
  "Descricao": "Cadeira ergonômica em bom estado",
  "Tipo_Material": "Móvel",
  "Estado_Conservacao": "Bom",
  "Categoria": "Escritório",
  "Imagem": "url_da_imagem",
  "Objetivo": "troca",
  "Localizacao": "São Paulo - SP",
  "Id_Usuario_FK": 1
}
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Material cadastrado com sucesso!",
  "materialId": 1
}
```

---

### Buscar Material por ID
**Endpoint:** `GET /api/materiais/:id`  
**Autenticação:** Requerida  
**Descrição:** Retorna os detalhes de um material específico

---

### Listar Materiais
**Endpoint:** `GET /api/materiais`  
**Autenticação:** Requerida  
**Descrição:** Lista materiais com filtros

**Query Parameters:**
- `disponibilidade` (opcional): true/false
- `tipo_material` (opcional): Tipo do material
- `categoria` (opcional): Categoria do material
- `estado_conservacao` (opcional): Estado de conservação
- `usuario_id` (opcional): ID do usuário proprietário
- `busca` (opcional): Busca por texto no título ou descrição
- `limite` (opcional): Número máximo de resultados
- `offset` (opcional): Deslocamento para paginação

**Exemplo:** `GET /api/materiais?disponibilidade=true&tipo_material=Móvel&limite=20`

---

### Atualizar Material
**Endpoint:** `PUT /api/materiais/:id`  
**Autenticação:** Requerida  
**Descrição:** Atualiza os dados de um material

---

### Alterar Disponibilidade
**Endpoint:** `PATCH /api/materiais/:id/disponibilidade`  
**Autenticação:** Requerida  
**Descrição:** Altera a disponibilidade de um material

**Body:**
```json
{
  "disponibilidade": false
}
```

---

### Excluir Material
**Endpoint:** `DELETE /api/materiais/:id`  
**Autenticação:** Requerida  
**Descrição:** Remove um material do sistema

---

## Trocas

### Criar Solicitação de Troca
**Endpoint:** `POST /api/trocas`  
**Autenticação:** Requerida  
**Descrição:** Cria uma nova solicitação de troca

**Body:**
```json
{
  "Id_Material_FK": 1,
  "Id_Usuario_Solicitante_FK": 2,
  "Id_Usuario_Doador_FK": 1,
  "Observacoes": "Gostaria muito deste material"
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": 1,
  "message": "Troca solicitada com sucesso!"
}
```

---

### Buscar Troca por ID
**Endpoint:** `GET /api/trocas/:id`  
**Autenticação:** Requerida  
**Descrição:** Retorna os detalhes de uma troca

---

### Listar Trocas
**Endpoint:** `GET /api/trocas`  
**Autenticação:** Requerida  
**Descrição:** Lista trocas com filtros

**Query Parameters:**
- `usuario_solicitante_id` (opcional): ID do usuário solicitante
- `usuario_doador_id` (opcional): ID do usuário doador
- `material_id` (opcional): ID do material
- `concluida` (opcional): true/false
- `limite` (opcional): Número máximo de resultados
- `offset` (opcional): Deslocamento para paginação

---

### Atualizar Troca
**Endpoint:** `PUT /api/trocas/:id`  
**Autenticação:** Requerida  
**Descrição:** Atualiza as observações de uma troca

---

### Concluir Troca
**Endpoint:** `PATCH /api/trocas/:id/concluir`  
**Autenticação:** Requerida  
**Descrição:** Marca uma troca como concluída e torna o material indisponível

**Resposta de Sucesso (200):**
```json
{
  "message": "Troca concluída com sucesso!"
}
```

---

### Cancelar Troca
**Endpoint:** `DELETE /api/trocas/:id`  
**Autenticação:** Requerida  
**Descrição:** Cancela uma troca pendente

---

## Denúncias

### Criar Denúncia
**Endpoint:** `POST /api/denuncias`  
**Autenticação:** Requerida  
**Descrição:** Registra uma nova denúncia

**Body:**
```json
{
  "Descricao": "Usuário não cumpriu com o combinado",
  "Tipo_Denuncia": "Comportamento inadequado",
  "Id_Usuario_Denunciante_FK": 1,
  "Id_Usuario_Denunciado_FK": 2,
  "Id_Material_FK": null,
  "Id_Troca_FK": 1
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": 1,
  "message": "Denúncia registrada com sucesso!"
}
```

---

### Buscar Denúncia por ID
**Endpoint:** `GET /api/denuncias/:id`  
**Autenticação:** Requerida  
**Descrição:** Retorna os detalhes de uma denúncia

---

### Listar Denúncias
**Endpoint:** `GET /api/denuncias`  
**Autenticação:** Requerida  
**Descrição:** Lista denúncias com filtros

**Query Parameters:**
- `tipo_denuncia` (opcional): Tipo da denúncia
- `status` (opcional): true/false (resolvida/não resolvida)
- `usuario_denunciante_id` (opcional): ID do denunciante
- `usuario_denunciado_id` (opcional): ID do denunciado
- `material_id` (opcional): ID do material relacionado
- `troca_id` (opcional): ID da troca relacionada
- `limite` (opcional): Número máximo de resultados
- `offset` (opcional): Deslocamento para paginação

---

### Atualizar Denúncia
**Endpoint:** `PUT /api/denuncias/:id`  
**Autenticação:** Requerida  
**Descrição:** Atualiza os dados de uma denúncia

---

### Resolver Denúncia
**Endpoint:** `PATCH /api/denuncias/:id/resolver`  
**Autenticação:** Requerida  
**Descrição:** Marca uma denúncia como resolvida

---

### Excluir Denúncia
**Endpoint:** `DELETE /api/denuncias/:id`  
**Autenticação:** Requerida  
**Descrição:** Remove uma denúncia do sistema

---

## Recomendações

### Criar Recomendação
**Endpoint:** `POST /api/recomendacoes`  
**Autenticação:** Requerida  
**Descrição:** Cria uma recomendação manual

**Body:**
```json
{
  "Motivo": "Material compatível com seus interesses",
  "Id_Usuario_FK": 1,
  "Id_Material_FK": 5
}
```

---

### Gerar Recomendações Automáticas
**Endpoint:** `POST /api/recomendacoes/gerar/:usuario_id`  
**Autenticação:** Requerida  
**Descrição:** Gera recomendações automáticas para um usuário

**Resposta de Sucesso (201):**
```json
{
  "message": "10 recomendações geradas com sucesso!",
  "total": 10,
  "ids": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}
```

---

### Buscar Recomendação por ID
**Endpoint:** `GET /api/recomendacoes/:id`  
**Autenticação:** Requerida  
**Descrição:** Retorna os detalhes de uma recomendação

---

### Listar Recomendações
**Endpoint:** `GET /api/recomendacoes`  
**Autenticação:** Requerida  
**Descrição:** Lista recomendações com filtros

**Query Parameters:**
- `usuario_id` (opcional): ID do usuário
- `material_id` (opcional): ID do material
- `apenas_disponiveis` (opcional): true/false
- `limite` (opcional): Número máximo de resultados
- `offset` (opcional): Deslocamento para paginação

---

### Atualizar Recomendação
**Endpoint:** `PUT /api/recomendacoes/:id`  
**Autenticação:** Requerida  
**Descrição:** Atualiza o motivo de uma recomendação

---

### Excluir Recomendação
**Endpoint:** `DELETE /api/recomendacoes/:id`  
**Autenticação:** Requerida  
**Descrição:** Remove uma recomendação

---

## Notificações

### Criar Notificação
**Endpoint:** `POST /api/notificacoes`  
**Autenticação:** Requerida  
**Descrição:** Cria uma nova notificação

**Body:**
```json
{
  "Titulo": "Nova troca solicitada",
  "Mensagem": "Você recebeu uma nova solicitação de troca",
  "Tipo_Notificacao": "troca",
  "Id_Usuario_FK": 1
}
```

---

### Buscar Notificação por ID
**Endpoint:** `GET /api/notificacoes/:id`  
**Autenticação:** Requerida  
**Descrição:** Retorna os detalhes de uma notificação

---

### Listar Notificações
**Endpoint:** `GET /api/notificacoes`  
**Autenticação:** Requerida  
**Descrição:** Lista notificações com filtros

**Query Parameters:**
- `usuario_id` (opcional): ID do usuário
- `tipo_notificacao` (opcional): Tipo da notificação
- `lida` (opcional): true/false
- `limite` (opcional): Número máximo de resultados
- `offset` (opcional): Deslocamento para paginação

---

### Contar Notificações Não Lidas
**Endpoint:** `GET /api/notificacoes/usuario/:usuario_id/nao-lidas`  
**Autenticação:** Requerida  
**Descrição:** Retorna o total de notificações não lidas de um usuário

**Resposta de Sucesso (200):**
```json
{
  "total": 5
}
```

---

### Atualizar Notificação
**Endpoint:** `PUT /api/notificacoes/:id`  
**Autenticação:** Requerida  
**Descrição:** Atualiza uma notificação

---

### Marcar Notificação como Lida
**Endpoint:** `PATCH /api/notificacoes/:id/lida`  
**Autenticação:** Requerida  
**Descrição:** Marca uma notificação como lida

---

### Marcar Todas como Lidas
**Endpoint:** `PATCH /api/notificacoes/usuario/:usuario_id/marcar-todas-lidas`  
**Autenticação:** Requerida  
**Descrição:** Marca todas as notificações de um usuário como lidas

---

### Excluir Notificação
**Endpoint:** `DELETE /api/notificacoes/:id`  
**Autenticação:** Requerida  
**Descrição:** Remove uma notificação

---

## Chats

### Criar Chat
**Endpoint:** `POST /api/chats`  
**Autenticação:** Requerida  
**Descrição:** Cria um novo chat entre dois usuários (ou retorna o existente)

**Body:**
```json
{
  "Id_Usuario1_FK": 1,
  "Id_Usuario2_FK": 2
}
```

**Resposta de Sucesso (201 ou 200):**
```json
{
  "id": 1,
  "message": "Chat criado com sucesso!",
  "existente": false
}
```

---

### Buscar Chat por ID
**Endpoint:** `GET /api/chats/:id`  
**Autenticação:** Requerida  
**Descrição:** Retorna os detalhes de um chat

---

### Listar Chats
**Endpoint:** `GET /api/chats`  
**Autenticação:** Requerida  
**Descrição:** Lista chats do usuário

**Query Parameters:**
- `usuario_id` (opcional): ID do usuário (retorna chats onde participa)
- `ativo` (opcional): true/false
- `limite` (opcional): Número máximo de resultados
- `offset` (opcional): Deslocamento para paginação

---

### Atualizar Chat
**Endpoint:** `PUT /api/chats/:id`  
**Autenticação:** Requerida  
**Descrição:** Atualiza o status de um chat

---

### Desativar Chat
**Endpoint:** `PATCH /api/chats/:id/desativar`  
**Autenticação:** Requerida  
**Descrição:** Desativa um chat

---

### Excluir Chat
**Endpoint:** `DELETE /api/chats/:id`  
**Autenticação:** Requerida  
**Descrição:** Remove um chat e todas as suas mensagens

---

## Mensagens

### Enviar Mensagem
**Endpoint:** `POST /api/mensagens`  
**Autenticação:** Requerida  
**Descrição:** Envia uma nova mensagem em um chat

**Body:**
```json
{
  "Conteudo": "Olá, tudo bem?",
  "Id_Chat_FK": 1,
  "Id_Usuario_Rementente_FK": 1
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": 1,
  "message": "Mensagem enviada com sucesso!"
}
```

---

### Buscar Mensagem por ID
**Endpoint:** `GET /api/mensagens/:id`  
**Autenticação:** Requerida  
**Descrição:** Retorna os detalhes de uma mensagem

---

### Listar Mensagens
**Endpoint:** `GET /api/mensagens`  
**Autenticação:** Requerida  
**Descrição:** Lista mensagens de um chat

**Query Parameters:**
- `chat_id` (obrigatório): ID do chat
- `usuario_remetente_id` (opcional): ID do remetente
- `lida` (opcional): true/false
- `limite` (opcional): Número máximo de resultados
- `offset` (opcional): Deslocamento para paginação

**Exemplo:** `GET /api/mensagens?chat_id=1&limite=50`

---

### Contar Mensagens Não Lidas
**Endpoint:** `GET /api/mensagens/chat/:chat_id/usuario/:usuario_id/nao-lidas`  
**Autenticação:** Requerida  
**Descrição:** Retorna o total de mensagens não lidas de um chat para um usuário

**Resposta de Sucesso (200):**
```json
{
  "total": 3
}
```

---

### Marcar Mensagem como Lida
**Endpoint:** `PATCH /api/mensagens/:id/lida`  
**Autenticação:** Requerida  
**Descrição:** Marca uma mensagem como lida

---

### Marcar Todas as Mensagens como Lidas
**Endpoint:** `PATCH /api/mensagens/chat/:chat_id/marcar-todas-lidas`  
**Autenticação:** Requerida  
**Descrição:** Marca todas as mensagens de um chat como lidas

**Body:**
```json
{
  "usuario_id": 1
}
```

---

### Excluir Mensagem
**Endpoint:** `DELETE /api/mensagens/:id`  
**Autenticação:** Requerida  
**Descrição:** Remove uma mensagem

---

## Códigos de Status HTTP

- **200 OK** - Requisição bem-sucedida
- **201 Created** - Recurso criado com sucesso
- **400 Bad Request** - Dados inválidos ou faltando
- **401 Unauthorized** - Token não fornecido ou inválido
- **404 Not Found** - Recurso não encontrado
- **500 Internal Server Error** - Erro interno do servidor

---

## Resumo das Atualizações de Segurança

### Novos Endpoints de Recuperação e Alteração de Senha

A API agora possui um sistema completo de gerenciamento de senhas:

**🔐 Recuperação de Senha (Esqueci Minha Senha)**
1. Usuário solicita recuperação via email (`POST /esqueci-senha`)
2. Sistema gera token único válido por 1 hora
3. Email enviado com link de recuperação
4. Usuário valida token (`GET /validar-token/:token`) - opcional
5. Usuário redefine senha (`POST /redefinir-senha/:token`)

**🔐 Alteração de Senha (Usuário Autenticado)**
- Usuário autenticado pode alterar senha (`PATCH /:id/senha`)
- Requer senha atual para validação
- Nova senha deve ter mínimo de caracteres

**Segurança Implementada:**
- Tokens temporários com expiração
- Mensagens genéricas para evitar enumeração de emails
- Hash de senhas com bcrypt
- Validação de força de senha
- Tokens invalidados após uso
