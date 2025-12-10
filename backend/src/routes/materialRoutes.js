import express from 'express';
import materialController from '../controllers/materialController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

// --- Rotas Públicas ---
router.get('/', materialController.listarMateriais);
router.get('/:id', materialController.buscarPorId);

// --- Rotas Protegidas (exigem autenticação JWT) ---

// Cadastro de material (POST) com upload (campo 'Imagem')
router.post(
  '/',
  authMiddleware,
  upload.single('Imagem'),
  materialController.cadastrarMaterial
);

// Alterar disponibilidade (PATCH)
router.patch('/:id/disponibilidade', authMiddleware, materialController.alterarDisponibilidade);

// Edição de material (PUT) com upload (campo 'Imagem' opcional)
router.put('/:id', authMiddleware, materialController.atualizarMaterial); // SEM MULTER
router.post('/atualizar/:id', authMiddleware, upload.single('Imagem'), materialController.atualizarMaterial);

// Exclusão de material (DELETE)
router.delete('/:id', authMiddleware, materialController.excluirMaterial);

export default router;

