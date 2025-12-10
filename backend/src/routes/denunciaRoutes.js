import express from 'express';
import denunciaController from '../controllers/denunciaController.js';
import verificarToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// ==============================================================================
// ROTAS DE DENÚNCIAS
// Base URL sugerida: http://localhost:3000/api/denuncias
// ==============================================================================

// 1. CRIAR DENÚNCIA
// Método: POST
// Função: Registra a denúncia e dispara a notificação automática para o dono do item
router.post('/', verificarToken, denunciaController.criarDenuncia);

// 2. BUSCAR DENÚNCIA POR ID
// Método: GET
// URL Exemplo: /api/denuncias/1
router.get('/:id', verificarToken, denunciaController.buscarPorId);

// 3. LISTAR DENÚNCIAS (COM FILTROS)
// Método: GET
// URL Exemplo: /api/denuncias?tipo_denuncia=Alerta&status=true
router.get('/', verificarToken, denunciaController.listarDenuncias);

// 4. ATUALIZAR DENÚNCIA
// Método: PUT
// URL Exemplo: /api/denuncias/1
router.put('/:id', verificarToken, denunciaController.atualizarDenuncia);

// 5. RESOLVER DENÚNCIA (Manual)
// Método: PATCH
// Nota: O sistema atual já resolve automaticamente ao criar, mas essa rota é útil para manutenção
router.patch('/:id/resolver', verificarToken, denunciaController.resolverDenuncia);

// 6. EXCLUIR DENÚNCIA
// Método: DELETE
// URL Exemplo: /api/denuncias/1
router.delete('/:id', verificarToken, denunciaController.excluirDenuncia);

export default router;