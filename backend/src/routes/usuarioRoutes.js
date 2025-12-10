import express from 'express';
import usuarioController from '../controllers/usuarioController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../config/multerConfig.js'; 

const router = express.Router();

// --- Rotas Públicas (não exigem autenticação) ---
router.post('/cadastro', upload.single('FotoPerfil'), usuarioController.cadastrarUsuario);
router.post('/login', usuarioController.loginUsuario);

// NOVA ROTA DE CONFIRMAÇÃO DE CONTA (Pública)
// O Frontend chamará essa rota enviando o token na URL (query params)
router.get('/confirmar-conta', usuarioController.confirmarConta);

// --- Rotas Públicas Recuperação de senha ---
router.post('/esqueci-senha', usuarioController.solicitarRecuperacaoSenha);
router.post('/redefinir-senha/:token', usuarioController.redefinirSenha);
router.get('/validar-token/:token', usuarioController.validarToken);


// --- Rotas Protegidas (exigem autenticação JWT) ---

// Rota para buscar o perfil do usuário logado
router.get('/perfil', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'Acesso ao perfil concedido!',
    usuario: req.usuario
  });
});

// Rota para Listar usuários
router.get('/', authMiddleware, usuarioController.listarUsuarios);

// --- ROTAS ESPECÍFICAS COM PARÂMETROS (Devem vir ANTES das genéricas) ---

// Atualizar apenas a foto
router.post('/foto/:id', authMiddleware, upload.single('FotoPerfil'), usuarioController.atualizarFoto);

router.patch('/:id/senha', authMiddleware, usuarioController.atualizarSenha);
router.patch('/:id/reativar', authMiddleware, usuarioController.reativarUsuario);
router.delete('/:id/permanente', authMiddleware, usuarioController.excluirUsuarioPermanente);

// --- ROTAS GENÉRICAS COM PARÂMETROS (Devem vir DEPOIS) ---
router.get('/:id', authMiddleware, usuarioController.buscarPorId);
router.put('/:id', authMiddleware, usuarioController.atualizarUsuario);
router.delete('/:id', authMiddleware, usuarioController.desativarUsuario);

export default router;