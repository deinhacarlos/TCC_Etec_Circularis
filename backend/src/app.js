import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Importação das Rotas
import usuarioRoutes from './routes/usuarioRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import trocaRoutes from './routes/trocaRoutes.js';
import denunciaRoutes from './routes/denunciaRoutes.js';
import recomendacaoRoutes from './routes/recomendacaoRoutes.js';
import notificacaoRoutes from './routes/notificacaoRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import mensagemRoutes from './routes/mensagemRoutes.js';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// --- CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS (IMAGENS) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// A pasta uploads está uma nível acima de src (../uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/materiais', materialRoutes);
app.use('/api/trocas', trocaRoutes);
app.use('/api/denuncias', denunciaRoutes);
app.use('/api/recomendacoes', recomendacaoRoutes);
app.use('/api/notificacoes', notificacaoRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/mensagens', mensagemRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Circularis - Sistema de Troca de Materiais Sustentáveis',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      usuarios: '/api/usuarios',
      materiais: '/api/materiais',
      trocas: '/api/trocas',
      denuncias: '/api/denuncias',
      recomendacoes: '/api/recomendacoes',
      notificacoes: '/api/notificacoes',
      chats: '/api/chats',
      mensagens: '/api/mensagens'
    }
  });
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// --- IMPORTANTE: REMOVIDO O app.listen DAQUI ---
// O servidor é iniciado exclusivamente pelo arquivo server.js

export default app;