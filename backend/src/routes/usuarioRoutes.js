import express from 'express';
import usuarioController from '../controllers/usuarioController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../config/multerConfig.js'; 

const router = express.Router();

// --- Rotas Públicas (não exigem autenticação) ---
router.post('/cadastro', upload.single('FotoPerfil'), usuarioController.cadastrarUsuario);
router.post('/login', usuarioController.loginUsuario);



// --- Rotas Públicas Recuperação de senha 
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

// Rotas específicas com parâmetros (devem vir primeiro)
router.patch('/:id/senha', authMiddleware, usuarioController.atualizarSenha);
router.patch('/:id/reativar', authMiddleware, usuarioController.reativarUsuario);
router.delete('/:id/permanente', authMiddleware, usuarioController.excluirUsuarioPermanente);

// Rotas genéricas com parâmetros (devem vir depois)
router.get('/:id', authMiddleware, usuarioController.buscarPorId);
router.put('/:id', authMiddleware, usuarioController.atualizarUsuario);
router.delete('/:id', authMiddleware, usuarioController.desativarUsuario);

export default router;