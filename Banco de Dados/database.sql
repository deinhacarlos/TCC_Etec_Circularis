CREATE DATABASE Circularis;
USE Circularis;

-- Usuário
CREATE TABLE Usuario (
    Id_Usuario INT AUTO_INCREMENT PRIMARY KEY,
    Nome_Completo VARCHAR(255),
    Email VARCHAR(255),
    Telefone VARCHAR(20),
    Senha VARCHAR(255),
    DataNascimento DATE,
    Endereco TEXT,
    FotoPerfil TEXT NOT NULL,
    Tipo_Usuario VARCHAR(50),
    Status INT,
    DataCadastro TIMESTAMP,
    PontosRanking INT
);

-- Material
CREATE TABLE Material (
    Id_Material INT AUTO_INCREMENT PRIMARY KEY,
    Titulo VARCHAR(255),
    Descricao TEXT,
    Tipo_Material VARCHAR(100),
    Estado_Conservacao VARCHAR(100),
    Categoria VARCHAR(100),
    Imagem TEXT,
    DataCadastro TIMESTAMP,
    Objetivo VARCHAR(100),
    Localizacao VARCHAR(255),
    Disponibilidade BOOLEAN,
    Id_Usuario_FK INT,
    FOREIGN KEY (Id_Usuario_FK) REFERENCES Usuario(Id_Usuario)
);

-- Troca
CREATE TABLE Troca (
    Id_Troca INT AUTO_INCREMENT PRIMARY KEY, 
    Data_Conclusao DATETIME,
    Id_Material_FK INT,
    Data_Solicitacao DATETIME,
    Id_Usuario_Solicitante_FK INT,
    Id_Usuario_Doador_FK INT,
    Observacoes TEXT,
    FOREIGN KEY (Id_Material_FK) REFERENCES Material(Id_Material),
    FOREIGN KEY (Id_Usuario_Solicitante_FK) REFERENCES Usuario(Id_Usuario),
    FOREIGN KEY (Id_Usuario_Doador_FK) REFERENCES Usuario(Id_Usuario)
);

-- Denúncia
CREATE TABLE Denuncia (
    Id_Denuncia INT AUTO_INCREMENT PRIMARY KEY, 
    Descricao TEXT,
    Tipo_Denuncia VARCHAR(100),
    Data_Denuncia DATETIME,
    Status BOOLEAN,
    Id_Usuario_Denunciante_FK INT,
    Id_Usuario_Denunciado_FK INT,
    Id_Material_FK INT,
    Id_Troca_FK INT,
    FOREIGN KEY (Id_Usuario_Denunciante_FK) REFERENCES Usuario(Id_Usuario),
    FOREIGN KEY (Id_Usuario_Denunciado_FK) REFERENCES Usuario(Id_Usuario),
    FOREIGN KEY (Id_Material_FK) REFERENCES Material(Id_Material),
    FOREIGN KEY (Id_Troca_FK) REFERENCES Troca(Id_Troca)
);

-- Notificação
CREATE TABLE Notificacao (
    Id_Notificacao INT AUTO_INCREMENT PRIMARY KEY, 
    Titulo VARCHAR(255),
    Mensagem TEXT,
    Tipo_Notificacao VARCHAR(100),
    DataEnvio DATETIME,
    Lida BOOLEAN,
    Id_Usuario_FK INT,
    FOREIGN KEY (Id_Usuario_FK) REFERENCES Usuario(Id_Usuario)
);

-- Recomendação
CREATE TABLE Recomendacao (
    Id_Recomendacao INT AUTO_INCREMENT PRIMARY KEY,
    DataRecomendacao DATETIME,
    Motivo TEXT,
    Id_Usuario_FK INT,
    Id_Material_FK INT,
    FOREIGN KEY (Id_Usuario_FK) REFERENCES Usuario(Id_Usuario),
    FOREIGN KEY (Id_Material_FK) REFERENCES Material(Id_Material)
);

-- Chat
CREATE TABLE Chat (
    Id_Chat INT AUTO_INCREMENT PRIMARY KEY, 
    Id_Usuario1_FK INT,
    Id_Usuario2_FK INT,
    DataCriacao DATETIME,
    Ativo BOOLEAN,
    FOREIGN KEY (Id_Usuario1_FK) REFERENCES Usuario(Id_Usuario),
    FOREIGN KEY (Id_Usuario2_FK) REFERENCES Usuario(Id_Usuario)
);

-- Mensagem
CREATE TABLE Mensagem (
    Id_Mensagem INT AUTO_INCREMENT PRIMARY KEY,
    Conteudo TEXT,
    DataEnvio DATETIME,
    Lida BOOLEAN,
    Id_Chat_FK INT,
    Id_Usuario_Remetente_FK INT,
    FOREIGN KEY (Id_Chat_FK) REFERENCES Chat(Id_Chat),
    FOREIGN KEY (Id_Usuario_Remetente_FK) REFERENCES Usuario(Id_Usuario)
);
