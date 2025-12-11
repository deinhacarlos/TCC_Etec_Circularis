import notificacaoService from '../services/notificacaoService.js';


async function criar(req, res) {
    try {
        const resultado = await notificacaoService.criarNotificacao(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        console.error("Erro ao criar notificação:", error);
        res.status(500).json({ error: error.message });
    }
}
// ===================================

async function listar(req, res) {
    try {
        const usuarioId = req.query.usuario_id || req.usuario?.id; 
        const notificacoes = await notificacaoService.listarNotificacoes(usuarioId);
        res.json(notificacoes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function marcarLida(req, res) {
    try {
        await notificacaoService.marcarComoLida(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function marcarTodasLidas(req, res) {
    try {
        const { userId } = req.params;
        await notificacaoService.marcarTodasComoLidas(userId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function excluir(req, res) {
    try {
        await notificacaoService.excluirNotificacao(req.params.id);
        res.json({ success: true, message: "Notificação excluída" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function excluirTodas(req, res) {
    try {
        const { userId } = req.params;
        await notificacaoService.excluirTodasDoUsuario(userId);
        res.json({ success: true, message: "Todas excluídas" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function contar(req, res) {
    try {
        const { userId } = req.params;
        const dados = await notificacaoService.contarNaoLidas(userId);
        res.json(dados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default { 
    criar, 
    listar, 
    marcarLida, 
    marcarTodasLidas, 
    excluir, 
    excluirTodas, 
    contar 
};