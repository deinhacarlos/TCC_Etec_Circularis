import express from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/usuarioRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import trocaRoutes from './routes/trocaRoutes.js';
import denunciaRoutes from './routes/denunciaRoutes.js';
import recomendacaoRoutes from './routes/recomendacaoRoutes.js';
import notificacaoRoutes from './routes/notificacaoRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import mensagemRoutes from './routes/mensagemRoutes.js';

const app = express();

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

export default app;
