# Guia Rápido - API Circularis

## 🚀 Início Rápido em 5 Passos

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados
- Crie um banco MySQL chamado `Circularis`
- Execute o script `database.sql` no MySQL:
```bash
mysql -u root -p Circularis < database.sql
```

### 3. Configurar Variáveis de Ambiente
- Copie `.env.example` para `.env`
- Edite `.env` com suas configurações:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=Circularis
JWT_SECRET=chave_secreta_forte
```

### 4. Iniciar o Servidor
```bash
npm start
# ou para desenvolvimento com auto-reload:
npm run dev
```

### 5. Testar a API
Acesse: `http://localhost:3000`

Você verá:
```json
{
  "message": "API Circularis - Sistema de Troca de Materiais Sustentáveis",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

## 📝 Primeiro Teste

### 1. Cadastrar um Usuário
```bash
curl -X POST http://localhost:3000/api/usuarios/cadastro \
  -H "Content-Type: application/json" \
  -d '{
    "Nome_Completo": "Teste Silva",
    "Email": "teste@example.com",
    "Senha": "senha123",
    "Tipo_Usuario": "comum"
  }'
```

### 2. Fazer Login
```bash
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "Email": "teste@example.com",
    "Senha": "senha123"
  }'
```

**Copie o token retornado!**

### 3. Cadastrar um Material
```bash
curl -X POST http://localhost:3000/api/materiais \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "Titulo": "Cadeira de Escritório",
    "Tipo_Material": "Móvel",
    "Estado_Conservacao": "Bom",
    "Id_Usuario_FK": 1
  }'
```

### 4. Listar Materiais
```bash
curl -X GET http://localhost:3000/api/materiais \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
npm run dev          # Inicia com nodemon (auto-reload)
```

### Produção
```bash
npm start            # Inicia o servidor
```

### Verificar Status
```bash
curl http://localhost:3000
```

## 📱 Testar com Postman/Insomnia

1. Importe a coleção de endpoints (veja `API_ENDPOINTS.md`)
2. Configure a variável de ambiente `baseURL` = `http://localhost:3000`
3. Configure a variável `token` após fazer login
4. Use `{{baseURL}}/api/usuarios/login` para autenticar
5. Use `{{token}}` no header Authorization

## 🔌 Testar Chat em Tempo Real (Socket.IO)

### Exemplo com JavaScript (Cliente)
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: { token: 'SEU_TOKEN_JWT' }
});

// Conectar
socket.on('connect', () => {
  console.log('Conectado!');
  
  // Entrar em um chat
  socket.emit('join_chat', 1);
});

// Receber mensagens
socket.on('receive_message', (data) => {
  console.log('Nova mensagem:', data);
});

// Enviar mensagem
socket.emit('send_message', {
  chatId: 1,
  mensagem: {
    Conteudo: "Olá!",
    Id_Usuario_Rementente_FK: 1
  }
});
```

## 🐛 Solução de Problemas

### Erro: "Cannot connect to MySQL"
- Verifique se o MySQL está rodando
- Confirme usuário e senha no `.env`
- Teste a conexão: `mysql -u root -p`

### Erro: "JWT must be provided"
- Certifique-se de incluir o token no header
- Formato: `Authorization: Bearer seu_token`

### Erro: "Port 3000 already in use"
- Mude a porta no `.env`: `PORT=3001`
- Ou mate o processo: `lsof -ti:3000 | xargs kill`

### Erro: "Table doesn't exist"
- Execute o script `database.sql`
- Verifique o nome do banco no `.env`

## 📚 Documentação Completa

- **README.md** - Documentação completa do projeto
- **API_ENDPOINTS.md** - Detalhes de todos os endpoints
- **ESTRUTURA_PROJETO.txt** - Estrutura de arquivos

## 💡 Dicas

1. **Sempre use HTTPS em produção**
2. **Nunca commite o arquivo `.env`**
3. **Use senhas fortes para JWT_SECRET**
4. **Configure CORS adequadamente em produção**
5. **Faça backup regular do banco de dados**

## 🎯 Próximos Passos

1. Explore todos os endpoints em `API_ENDPOINTS.md`
2. Teste as funcionalidades de chat em tempo real
3. Implemente o frontend conectando à API
4. Configure ambiente de produção
5. Adicione testes automatizados

## 📞 Suporte

Para dúvidas sobre o projeto, consulte a documentação completa ou entre em contato com os desenvolvedores.

---

**Boa sorte com o desenvolvimento! 🚀**
