import jwt from 'jsonwebtoken';

// Middleware para verificar o token JWT
const authMiddleware = (req, res, next) => {
  // Tenta obter o token do cabeçalho 'Authorization'
  const authHeader = req.headers.authorization;

  // Verifica se o cabeçalho de autorização existe e começa com 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido ou mal formatado.' });
  }

  // Extrai o token (removendo 'Bearer ')
  const token = authHeader.split(' ')[1];

  try {
    // Verifica e decodifica o token usando a chave secreta
    const decoded = jwt.verify(token, process.env.JWT_SEGREDO);
    
    // Adiciona as informações do usuário decodificadas ao objeto de requisição
    req.usuario = decoded; 
    
    // Chama a próxima função middleware ou o handler da rota
    next();
  } catch (error) {
    // Se o token for inválido ou expirado
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

export default authMiddleware;
