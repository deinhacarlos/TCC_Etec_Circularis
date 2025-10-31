import express from 'express';
import recomendacaoController from '../controllers/recomendacaoController.js';
import verificarToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// Criar nova recomendação
router.post('/', verificarToken, recomendacaoController.criarRecomendacao);

// Gerar recomendações automáticas para um usuário
router.post('/gerar/:usuario_id', verificarToken, recomendacaoController.gerarRecomendacoes);

// Buscar recomendação por ID
router.get('/:id', verificarToken, recomendacaoController.buscarPorId);

// Listar recomendações com filtros
router.get('/', verificarToken, recomendacaoController.listarRecomendacoes);

// Atualizar recomendação
router.put('/:id', verificarToken, recomendacaoController.atualizarRecomendacao);

// Excluir recomendação
router.delete('/:id', verificarToken, recomendacaoController.excluirRecomendacao);

export default router;
