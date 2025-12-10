// src/services/usuarioService.js
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto'; 

// --- Configuração do Nodemailer ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- CADASTRO ---
async function cadastrarUsuario(dados) {
  const { NomeCompleto, Email, Senha, Telefone, FotoPerfil } = dados;
  
  if (!NomeCompleto || !Email || !Senha) {
    throw new Error("Nome, Email e Senha são obrigatórios.");
  }

  // Verifica se já existe
  const [existente] = await pool.query('SELECT Id_Usuario FROM Usuario WHERE Email = ?', [Email]);
  if (existente.length > 0) {
    throw new Error("E-mail já cadastrado.");
  }

  const senhaCriptografada = await bcrypt.hash(Senha, 10);
  const fotoFinal = FotoPerfil || 'padrao.png'; 

  try {
    const [resultado] = await pool.query(
      'INSERT INTO Usuario (Nome_Completo, Email, Telefone, Senha, DataNascimento, Endereco, FotoPerfil, Tipo_Usuario, Status, DataCadastro, PontosRanking) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        NomeCompleto, Email, Telefone, senhaCriptografada,
        null, null, fotoFinal, 'comum', 0, new Date(), 0
      ]
    );

    const novoId = resultado.insertId;
    
    // Envio de e-mail de confirmação (opcional, mantido do seu código original)
    const token = jwt.sign({ id: novoId, tipo: 'confirmacao_email' }, process.env.JWT_SEGREDO, { expiresIn: '24h' });
    const link = `http://127.0.0.1:8080/verificacao-email.html?token=${token}`; 

    await transporter.sendMail({
      from: '"Circularis" <noreply@circularis.com>',
      to: Email,
      subject: 'Bem-vindo ao Circularis! Confirme sua conta',
      html: `<h3>Olá, ${NomeCompleto}!</h3><p>Para ativar sua conta, clique no link:</p><a href="${link}" target="_blank">CONFIRMAR MEU E-MAIL</a>`
    });

    return { id: novoId };
  } catch (error) {
    console.error("ERRO NO SERVICE (cadastrarUsuario):", error);
    throw new Error(error.message || "Erro ao inserir usuário.");
  }
}

// --- CONFIRMAÇÃO DE CONTA ---
async function confirmarConta(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SEGREDO);
    if (decoded.tipo !== 'confirmacao_email') throw new Error('Token inválido.');
    
    const [resultado] = await pool.query('UPDATE Usuario SET Status = 1 WHERE Id_Usuario = ?', [decoded.id]);
    if (resultado.affectedRows === 0) throw new Error('Usuário não encontrado.');
    
    return { message: 'Conta ativada com sucesso!' };
  } catch (error) {
    throw new Error("Link inválido ou expirado.");
  }
}

// --- LOGIN ---
async function loginUsuario(dados) {
  const { Email, Senha } = dados;
  if (!Email || !Senha) throw new Error('Email e Senha são obrigatórios.');

  try {
    const [rows] = await pool.query('SELECT Id_Usuario, Nome_Completo, Email, Senha, Status, FotoPerfil FROM Usuario WHERE Email = ?', [Email]);
    const usuario = rows[0];

    if (!usuario) throw new Error('Usuário não encontrado.');
    // if (usuario.Status === 0) throw new Error('Por favor, confirme seu e-mail antes de fazer login.');

    const senhaCorreta = await bcrypt.compare(Senha, usuario.Senha);
    if (!senhaCorreta) throw new Error('Senha incorreta.');

    const token = jwt.sign({ id: usuario.Id_Usuario, email: usuario.Email }, process.env.JWT_SEGREDO, { expiresIn: '8h' });

    return { 
        token, 
        userId: usuario.Id_Usuario, 
        nome: usuario.Nome_Completo,
        foto: usuario.FotoPerfil 
    };
  } catch (error) {
    console.error("ERRO LOGIN:", error);
    throw new Error(error.message || "Erro ao realizar login.");
  }
}

// --- RECUPERAÇÃO DE SENHA: SOLICITAR (ENVIA O E-MAIL) ---
async function solicitarRecuperacaoSenha(email) {
  console.log(`[Service] Solicitando recuperação para: ${email}`);

  // 1. Busca usuário
  const [rows] = await pool.query('SELECT Id_Usuario, Nome_Completo FROM Usuario WHERE Email = ?', [email]);
  const usuario = rows[0];

  if (!usuario) {
    console.log(`[Service] E-mail não encontrado no banco.`);
    return; // Retorna silenciosamente por segurança
  }

  // 2. Gera token e expiração (1 hora)
  const token = crypto.randomBytes(20).toString('hex');
  const expiracao = new Date(Date.now() + 3600000); // 1 hora a partir de agora

  // 3. Salva no banco (AQUI QUE PRECISA DAS NOVAS COLUNAS)
  try {
      await pool.query('UPDATE Usuario SET TokenRecuperacao = ?, TokenExpiracao = ? WHERE Id_Usuario = ?', [token, expiracao, usuario.Id_Usuario]);
  } catch (err) {
      console.error("[Service] Erro ao salvar token no banco. Verifique se as colunas TokenRecuperacao/TokenExpiracao existem.", err);
      throw new Error("Erro interno ao gerar token.");
  }

  // 4. Envia E-mail
  // ATENÇÃO: Verifique se essa porta (5500) é a mesma que você usa para abrir o HTML no navegador
  const link = `http://127.0.0.1:8080/redefinir-senha.html?token=${token}`;

  console.log(`[Service] Enviando e-mail...`);
  await transporter.sendMail({
    from: '"Circularis Suporte" <projetocircularis@gmail.com>',
    to: email,
    subject: 'Redefinir sua senha - Circularis',
    html: `
      <div style="font-family: Arial; color: #333;">
        <h2 style="color: #6C63FF;">Recuperação de Senha</h2>
        <p>Olá, <strong>${usuario.Nome_Completo}</strong>.</p>
        <p>Recebemos uma solicitação para redefinir sua senha.</p>
        <p>Clique no botão abaixo para criar uma nova senha:</p>
        <a href="${link}" style="background-color: #5FD068; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">REDEFINIR MINHA SENHA</a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">O link expira em 1 hora.</p>
      </div>
    `
  });
  console.log(`[Service] E-mail enviado com sucesso!`);
}

// --- RECUPERAÇÃO DE SENHA: REDEFINIR (SALVA A NOVA SENHA) ---
async function redefinirSenha(token, novaSenha) {
  // 1. Verifica token e validade
  const [rows] = await pool.query('SELECT Id_Usuario, TokenExpiracao FROM Usuario WHERE TokenRecuperacao = ?', [token]);
  const usuario = rows[0];

  if (!usuario) throw new Error('Token inválido ou não encontrado.');
  if (new Date() > new Date(usuario.TokenExpiracao)) throw new Error('Este link expirou. Solicite um novo.');

  // 2. Criptografa nova senha
  if (novaSenha.length < 8) throw new Error('A senha deve ter no mínimo 8 caracteres.');
  const hash = await bcrypt.hash(novaSenha, 10);

  // 3. Atualiza senha e limpa o token para não ser usado de novo
  await pool.query('UPDATE Usuario SET Senha = ?, TokenRecuperacao = NULL, TokenExpiracao = NULL WHERE Id_Usuario = ?', [hash, usuario.Id_Usuario]);

  return { message: 'Senha alterada com sucesso.' };
}

// --- VALIDAR TOKEN (Opcional, para o frontend checar antes de mostrar o form) ---
async function validarTokenRecuperacao(token) {
    const [rows] = await pool.query('SELECT Id_Usuario, TokenExpiracao FROM Usuario WHERE TokenRecuperacao = ?', [token]);
    const usuario = rows[0];

    if (!usuario) throw new Error('Token inválido.');
    if (new Date() > new Date(usuario.TokenExpiracao)) throw new Error('Token expirado.');
    
    return true;
}

// --- OUTRAS FUNÇÕES ---
async function buscarUsuarioPorId(id) {
  try {
    const [rows] = await pool.query('SELECT Id_Usuario, Nome_Completo, Email, Telefone, DataNascimento, Endereco, FotoPerfil, Tipo_Usuario, Status, DataCadastro, PontosRanking FROM Usuario WHERE Id_Usuario = ?', [id]);
    if (!rows[0]) throw new Error('Usuário não encontrado.');
    return rows[0];
  } catch (error) { throw new Error(error.message); }
}

async function listarUsuarios() {
  const [rows] = await pool.query('SELECT Id_Usuario, Nome_Completo, Email FROM Usuario');
  return rows;
}

async function atualizarUsuario(id, dados) {
    const { Nome_Completo, Email, Telefone, Endereco, FotoPerfil } = dados;
    const campos = [];
    const valores = [];
    if (Nome_Completo) { campos.push('Nome_Completo = ?'); valores.push(Nome_Completo); }
    if (Email) { campos.push('Email = ?'); valores.push(Email); }
    if (Telefone) { campos.push('Telefone = ?'); valores.push(Telefone); }
    if (Endereco) { campos.push('Endereco = ?'); valores.push(Endereco); }
    if (FotoPerfil) { campos.push('FotoPerfil = ?'); valores.push(FotoPerfil); }
    
    if (campos.length === 0) throw new Error('Nenhum dado válido.');
    valores.push(id);
    await pool.query(`UPDATE Usuario SET ${campos.join(', ')} WHERE Id_Usuario = ?`, valores);
    return { message: 'Atualizado!', foto: FotoPerfil };
}

async function atualizarSenha(id, s1, s2) { /* Sua implementação de troca de senha logado */ }
async function desativarUsuario(id) { await pool.query('UPDATE Usuario SET Status = 0 WHERE Id_Usuario = ?', [id]); return { message: 'Desativado.' }; }
async function reativarUsuario(id) { await pool.query('UPDATE Usuario SET Status = 1 WHERE Id_Usuario = ?', [id]); return { message: 'Reativado.' }; }
async function excluirUsuarioPermanente(id) { await pool.query('DELETE FROM Usuario WHERE Id_Usuario = ?', [id]); return { message: 'Excluído.' }; }

const usuarioService = {
  cadastrarUsuario,
  confirmarConta,
  loginUsuario,
  buscarUsuarioPorId, 
  listarUsuarios,
  atualizarUsuario,
  atualizarSenha,
  desativarUsuario,
  reativarUsuario,
  excluirUsuarioPermanente,
  solicitarRecuperacaoSenha, 
  validarTokenRecuperacao,   
  redefinirSenha             
};

export default usuarioService;