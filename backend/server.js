// Importa e configura as variáveis de ambiente do arquivo .env
import 'dotenv/config';
// Importa a aplicação Express configurada do arquivo app.js
import app from './src/app.js';
// Importa http para criar servidor compatível com Socket.IO
import { createServer } from 'http';
// Importa o handler do Socket.IO
import { initializeSocket } from './src/config/socketHandler.js';

// Define a porta em que o servidor vai rodar.
const PORT = process.env.PORT || 3000;

// Cria servidor HTTP
const server = createServer(app);

// Inicializa Socket.IO
initializeSocket(server);

// Inicia o servidor
server.listen(PORT, () => {
  console.log(`✅ Servidor HTTP rodando com sucesso na porta ${PORT}`);
  console.log(`✅ Socket.IO inicializado e pronto para conexões em tempo real`);
});
