import trocaService from '../services/trocaService.js';

async function criarTroca(req, res) {
  try {
    const resultado = await trocaService.criarTroca(req.body);
    return res.status(201).json(resultado);
  } catch (error) {
    console.error("ERRO CONTROLLER:", error.message);
    if (error.message.includes('obrigatórios') || error.message.includes('próprio material')) {
        return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno.", erro: error.message });
  }
}

async function listarTrocas(req, res) {
  try {
    // Filtros vindos da URL
    const filtros = {
      usuario_solicitante_id: req.query.usuario_solicitante_id,
      usuario_doador_id: req.query.usuario_doador_id
    };
    const trocas = await trocaService.listarTrocas(filtros);
    return res.status(200).json(trocas);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao listar.", erro: error.message });
  }
}

// === FUNÇÃO UNIFICADA DE RESPOSTA ===
async function responderTroca(req, res) {
  try {
    const { id } = req.params;     // ID da Troca
    const { status } = req.body;   // 'Aceito', 'Rejeitado', 'Concluido', 'Cancelado'
    
    // Pega o ID do usuário logado pelo Token (se você tiver middleware de auth)
    // Se não tiver middleware configurado ainda, pode passar null ou pegar do body.
    // Assumindo que req.usuario ou req.user existe pelo AuthMiddleware:
    const usuarioId = req.usuario ? req.usuario.id : null; 

    const resultado = await trocaService.atualizarStatusTroca(id, status, usuarioId);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("ERRO RESPONDER:", error.message);
    return res.status(400).json({ message: error.message });
  }
}

// Manter outras funções se as rotas existirem, redirecionando para o service
async function buscarPorId(req, res) { /* ... */ }
async function atualizarTroca(req, res) { /* ... */ }
async function concluirTroca(req, res) { /* ... */ }
async function cancelarTroca(req, res) { /* ... */ }

const trocaController = {
  criarTroca,
  listarTrocas,
  responderTroca, // IMPORTANTE: Sua rota PATCH deve apontar para cá
  buscarPorId,
  atualizarTroca,
  concluirTroca,
  cancelarTroca
};

export default trocaController;