import express from 'express';
import materialController from '../controllers/materialController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

// 1. Importe o multer
import multer from 'multer';
const upload = multer(); // usando memória padrão, ajuste se quiser salvar arquivos no disco/local

const router = express.Router();

// --- Rotas Públicas ---
router.get('/', materialController.listarMateriais);
router.get('/:id', materialController.buscarPorId);

// --- Rotas Protegidas (exigem autenticação JWT) ---
// 2. Insira upload.single('Imagem') ANTES do controller
router.post(
  '/',
  authMiddleware,
  upload.single('Imagem'),   // <-- ESSENCIAL para multipart/form-data do frontend
  materialController.cadastrarMaterial
);

router.patch('/:id/disponibilidade', authMiddleware, materialController.alterarDisponibilidade);
router.put('/:id', authMiddleware, materialController.atualizarMaterial);
router.delete('/:id', authMiddleware, materialController.excluirMaterial);

export default router;
