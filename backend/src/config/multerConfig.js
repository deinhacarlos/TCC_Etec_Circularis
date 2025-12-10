import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Configuração para garantir que a pasta uploads existe
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ajuste o caminho conforme a estrutura do seu projeto
// Se 'src' e 'uploads' estiverem na raiz:
const uploadPath = path.join(__dirname, '../../uploads'); 

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Configuração de Armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Gera um nome único: data-random.extensão
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro de Arquivos (Aqui definimos os formatos aceitos)
const fileFilter = (req, file, cb) => {
    // Lista de tipos permitidos (Regex)
    const allowedTypes = /jpeg|jpg|png|gif|webp|bmp/;
    
    // Verifica a extensão
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    // Verifica o tipo MIME (o tipo real do arquivo)
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        // Retorna erro se o formato não for aceito
        cb(new Error('Formato inválido! Apenas imagens (JPG, PNG, GIF, WEBP, BMP) são permitidas.'));
    }
};

// Limites (Opcional: aqui está 5MB)
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: fileFilter 
});

export default upload;