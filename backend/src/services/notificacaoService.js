import pool from '../config/db.js';

async function criarNotificacao(dados) {
  const { Titulo, Mensagem, Tipo_Notificacao, Id_Usuario_FK } = dados;
  const [res] = await pool.query(
    `INSERT INTO Notificacao (Titulo, Mensagem, Tipo_Notificacao, DataEnvio, Lida, Id_Usuario_FK) VALUES (?, ?, ?, ?, ?, ?)`,
    [Titulo, Mensagem, Tipo_Notificacao, new Date(), false, Id_Usuario_FK]
  );
  return { id: res.insertId, message: 'Criada.' };
}

async function listarNotificacoes(usuarioId) {
  // Ordena da mais recente para a mais antiga
  const [rows] = await pool.query('SELECT * FROM Notificacao WHERE Id_Usuario_FK = ? ORDER BY DataEnvio DESC', [usuarioId]);
  return rows;
}

async function marcarComoLida(id) {
  await pool.query('UPDATE Notificacao SET Lida = 1 WHERE Id_Notificacao = ?', [id]);
  return { message: 'Marcada como lida' };
}

async function marcarTodasComoLidas(usuarioId) {
  await pool.query('UPDATE Notificacao SET Lida = 1 WHERE Id_Usuario_FK = ?', [usuarioId]);
  return { message: 'Todas lidas' };
}

// --- EXCLUSÃO INDIVIDUAL ---
async function excluirNotificacao(id) {
  const [res] = await pool.query('DELETE FROM Notificacao WHERE Id_Notificacao = ?', [id]);
  if (res.affectedRows === 0) throw new Error('Notificação não encontrada.');
  return { message: 'Excluída com sucesso' };
}

// --- EXCLUSÃO TOTAL (NOVO) ---
async function excluirTodasDoUsuario(usuarioId) {
  const [res] = await pool.query('DELETE FROM Notificacao WHERE Id_Usuario_FK = ?', [usuarioId]);
  return { message: 'Todas as notificações foram excluídas', total: res.affectedRows };
}

async function contarNaoLidas(usuarioId) {
  const [rows] = await pool.query('SELECT COUNT(*) as total FROM Notificacao WHERE Id_Usuario_FK = ? AND Lida = 0', [usuarioId]);
  return { total: rows[0].total };
}

export default {
  criarNotificacao,
  listarNotificacoes,
  marcarComoLida,
  marcarTodasComoLidas,
  excluirNotificacao,
  excluirTodasDoUsuario, 
  contarNaoLidas
};