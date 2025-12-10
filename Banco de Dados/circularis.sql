-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 10/12/2025 às 05:04
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `circularis`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `chat`
--

CREATE TABLE `chat` (
  `Id_Chat` int(11) NOT NULL,
  `Id_Usuario1_FK` int(11) DEFAULT NULL,
  `Id_Usuario2_FK` int(11) DEFAULT NULL,
  `DataCriacao` datetime DEFAULT NULL,
  `Ativo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `chat`
--

INSERT INTO `chat` (`Id_Chat`, `Id_Usuario1_FK`, `Id_Usuario2_FK`, `DataCriacao`, `Ativo`) VALUES
(1, 5, 3, '2025-11-29 19:08:03', 1),
(2, 7, 3, '2025-12-08 21:48:37', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `denuncia`
--

CREATE TABLE `denuncia` (
  `Id_Denuncia` int(11) NOT NULL,
  `Descricao` text DEFAULT NULL,
  `Tipo_Denuncia` varchar(100) DEFAULT NULL,
  `Data_Denuncia` datetime DEFAULT NULL,
  `Status` tinyint(1) DEFAULT NULL,
  `Id_Usuario_Denunciante_FK` int(11) DEFAULT NULL,
  `Id_Usuario_Denunciado_FK` int(11) DEFAULT NULL,
  `Id_Material_FK` int(11) DEFAULT NULL,
  `Id_Troca_FK` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `material`
--

CREATE TABLE `material` (
  `Id_Material` int(11) NOT NULL,
  `Titulo` varchar(255) DEFAULT NULL,
  `Descricao` text DEFAULT NULL,
  `Tipo_Material` varchar(100) DEFAULT NULL,
  `Estado_Conservacao` varchar(100) DEFAULT NULL,
  `Categoria` varchar(100) DEFAULT NULL,
  `Autor` varchar(255) DEFAULT NULL,
  `Imagem` text DEFAULT NULL,
  `DataCadastro` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Objetivo` varchar(100) DEFAULT NULL,
  `Localizacao` varchar(255) DEFAULT NULL,
  `Disponibilidade` tinyint(1) DEFAULT NULL,
  `Id_Usuario_FK` int(11) DEFAULT NULL,
  `DataAlteracao` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `material`
--

INSERT INTO `material` (`Id_Material`, `Titulo`, `Descricao`, `Tipo_Material`, `Estado_Conservacao`, `Categoria`, `Autor`, `Imagem`, `DataCadastro`, `Objetivo`, `Localizacao`, `Disponibilidade`, `Id_Usuario_FK`, `DataAlteracao`) VALUES
(5, 'Harry Potter E A Pedra Filosofal', 'Livro sem rasuras, em ótimo estado.', 'Livro', 'Bom', 'Literatura Juvenil, Fantasia', 'J. K. Rowling', '1764119030701-885268635.jpg', '2025-11-30 05:03:13', 'troca', 'Guarulhos/SP', 0, 3, '2025-11-30 02:03:13'),
(8, 'Dom Casmurro', 'Livro sem rasuras em ótimo estado de convervação', 'Livro', 'Regular', 'Literatura Brasileira / Romance', 'Machado De Assis', '1764275644133-257877100.jpg', '2025-11-28 05:26:40', 'doacao', 'Recife/PE', 1, 3, '2025-11-28 02:26:40'),
(9, 'Dom Casmurro', 'livro em ótimo estado', 'Livro', 'Ruim', 'Literatura Brasileira / Romance', 'Machado De Assis', '1764380081341-996533761.jpg', '2025-11-29 01:35:11', 'doacao', 'Minas Gerais/MG', 1, 3, '2025-11-28 22:35:11'),
(10, 'Entendendo Algoritmos: Um Guia Ilustrado Para Programadores E Outros Curiosos', 'Livro praticamente novo, lido apenas uma vez. Ótimo para quem está começando na área de desenvolvimento de sistemas. Sem rasuras ou amassados.', 'Livro', 'Regular', 'Tecnologia, Programação, Ciência Da Computação', 'Aditya Y. Bhargava', '1764886769882-485654356.jpg', '2025-12-09 01:00:44', 'troca', 'Guarulhos/SP', 1, 3, '2025-12-08 22:00:44'),
(11, 'Vidas Secas', 'Livro em ótimo estado, apenas com algumas rasuras na capa.', 'Livro', 'Regular', 'Drama', 'Graciliano Ramos', '1765326682611-929870101.jpg', '2025-12-10 00:35:30', 'troca', 'Guarulhos/SP', 1, 3, '2025-12-09 21:35:30');

-- --------------------------------------------------------

--
-- Estrutura para tabela `mensagem`
--

CREATE TABLE `mensagem` (
  `Id_Mensagem` int(11) NOT NULL,
  `Conteudo` text DEFAULT NULL,
  `DataEnvio` datetime DEFAULT NULL,
  `Lida` tinyint(1) DEFAULT NULL,
  `Id_Chat_FK` int(11) DEFAULT NULL,
  `Id_Usuario_Remetente_FK` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `mensagem`
--

INSERT INTO `mensagem` (`Id_Mensagem`, `Conteudo`, `DataEnvio`, `Lida`, `Id_Chat_FK`, `Id_Usuario_Remetente_FK`) VALUES
(1, 'Olá Andréa Alves dos Santos, tenho interesse no seu material \"Harry Potter E A Pedra Filosofal\". Podemos combinar a troca?', '2025-11-29 19:39:42', 0, 1, 5),
(2, 'Olá Andréa Alves dos Santos, tenho interesse no seu material \"Harry Potter E A Pedra Filosofal\". Podemos combinar a troca?', '2025-11-29 19:56:33', 0, 1, 5),
(3, 'Olá Andréa Alves dos Santos, tenho interesse no seu material \"Harry Potter E A Pedra Filosofal\". Podemos combinar a troca?', '2025-11-29 20:31:35', 0, 1, 5),
(4, 'Olá Andréa Alves dos Santos, tenho interesse no seu material \"Harry Potter E A Pedra Filosofal\". Podemos combinar a troca?', '2025-11-30 00:17:22', 0, 1, 5),
(5, 'Olá Andréa Alves dos Santos, tenho interesse no seu material \"Harry Potter E A Pedra Filosofal\". Podemos combinar a troca?', '2025-11-30 00:40:09', 0, 1, 5),
(6, 'olá, sim podemos troca, vc teria o livro Os miseráveis?', '2025-11-30 00:42:11', 0, 1, 3),
(7, 'Sim tenho, podemos concluir a troca então. Vamos nos encontrar ou prefere enviar pelos correios?', '2025-11-30 00:43:19', 0, 1, 5),
(8, 'Pode ser pelos correios meu endereço é rua um, numero 100, São Paulo', '2025-11-30 00:44:47', 0, 1, 3),
(9, 'Ok, o meu endereço é rua 2, numero 200, Guarulhos', '2025-11-30 02:00:39', 0, 1, 5),
(10, 'Ok, vou atulizar o material para troca concluida e já preparar o envio, lembrando que se vc não enviar o seu material posso te denunciar na comunidade', '2025-11-30 02:02:11', 0, 1, 3),
(11, 'Ok, fique tranquilho, já vou preparar o envio', '2025-11-30 02:02:43', 0, 1, 5),
(12, 'Olá Andréa Alves dos Santos, tenho interesse no seu material \"Entendendo Algoritmos: Um Guia Ilustrado Para Programadores E Outros Curiosos\". Podemos combinar?', '2025-12-08 21:48:37', 0, 2, 7),
(13, 'Oi, tudo bem, podemos trocar sim. Qual livor vc tem para trocar?', '2025-12-08 21:49:52', 0, 2, 3),
(14, 'Eu tenho o livro Crepúsculo, tem interesse?', '2025-12-08 21:51:38', 0, 2, 7),
(15, 'Tenho sim, podemos agendar a troca?', '2025-12-08 21:52:06', 0, 2, 3);

-- --------------------------------------------------------

--
-- Estrutura para tabela `notificacao`
--

CREATE TABLE `notificacao` (
  `Id_Notificacao` int(11) NOT NULL,
  `Titulo` varchar(255) DEFAULT NULL,
  `Mensagem` text DEFAULT NULL,
  `Tipo_Notificacao` varchar(100) DEFAULT NULL,
  `DataEnvio` datetime DEFAULT NULL,
  `Lida` tinyint(1) DEFAULT NULL,
  `Id_Usuario_FK` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `notificacao`
--

INSERT INTO `notificacao` (`Id_Notificacao`, `Titulo`, `Mensagem`, `Tipo_Notificacao`, `DataEnvio`, `Lida`, `Id_Usuario_FK`) VALUES
(4, 'Nova Solicitação de Troca', 'Alguém tem interesse no seu livro e iniciou uma conversa!', 'SolicitacaoTroca', '2025-11-30 00:17:22', 1, 3),
(5, 'Nova Solicitação de Troca', 'Alguém tem interesse no seu livro e iniciou uma conversa!', 'SolicitacaoTroca', '2025-11-30 00:40:09', 1, 3),
(6, 'Nova Mensagem', 'Você recebeu uma mensagem no chat.', 'Mensagem', '2025-11-30 00:42:11', 1, 5),
(7, 'Nova Mensagem', 'Você recebeu uma mensagem no chat.', 'Mensagem', '2025-11-30 00:43:19', 1, 3),
(8, 'Nova Mensagem', 'Você recebeu uma mensagem no chat.', 'Mensagem', '2025-11-30 00:44:47', 1, 5),
(9, 'Nova Mensagem', 'Você recebeu uma mensagem no chat.', 'Mensagem', '2025-11-30 02:00:39', 1, 3),
(10, 'Nova Mensagem', 'Você recebeu uma mensagem no chat.', 'Mensagem', '2025-11-30 02:02:11', 1, 5),
(11, 'Nova Mensagem', 'Você recebeu uma mensagem no chat.', 'Mensagem', '2025-11-30 02:02:43', 1, 3),
(12, 'Nova Mensagem', 'Você recebeu uma mensagem no chat.', 'Mensagem', '2025-12-08 21:48:37', 1, 3),
(13, 'Nova Mensagem', 'Você recebeu uma mensagem no chat.', 'Mensagem', '2025-12-08 21:49:52', 1, 7),
(14, 'Nova Mensagem', 'Você recebeu uma mensagem no chat.', 'Mensagem', '2025-12-08 21:51:38', 1, 3),
(15, 'Nova Mensagem', 'Você recebeu uma mensagem no chat.', 'Mensagem', '2025-12-08 21:52:06', 1, 7);

-- --------------------------------------------------------

--
-- Estrutura para tabela `recomendacao`
--

CREATE TABLE `recomendacao` (
  `Id_Recomendacao` int(11) NOT NULL,
  `DataRecomendacao` datetime DEFAULT NULL,
  `Motivo` text DEFAULT NULL,
  `Id_Usuario_FK` int(11) DEFAULT NULL,
  `Id_Material_FK` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `troca`
--

CREATE TABLE `troca` (
  `Id_Troca` int(11) NOT NULL,
  `Data_Conclusao` datetime DEFAULT NULL,
  `Status` varchar(20) DEFAULT 'Pendente',
  `Id_Material_FK` int(11) DEFAULT NULL,
  `Data_Solicitacao` datetime DEFAULT NULL,
  `Id_Usuario_Solicitante_FK` int(11) DEFAULT NULL,
  `Id_Usuario_Doador_FK` int(11) DEFAULT NULL,
  `Observacoes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `troca`
--

INSERT INTO `troca` (`Id_Troca`, `Data_Conclusao`, `Status`, `Id_Material_FK`, `Data_Solicitacao`, `Id_Usuario_Solicitante_FK`, `Id_Usuario_Doador_FK`, `Observacoes`) VALUES
(1, '2025-11-30 02:03:13', 'Concluido', 5, '2025-11-30 00:17:22', 5, 3, 'Iniciado via Chat'),
(2, NULL, 'Pendente', 10, '2025-12-08 21:48:37', 7, 3, 'Iniciado via Chat');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `Id_Usuario` int(11) NOT NULL,
  `Nome_Completo` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Telefone` varchar(20) DEFAULT NULL,
  `Senha` varchar(255) DEFAULT NULL,
  `DataNascimento` date DEFAULT NULL,
  `Endereco` text DEFAULT NULL,
  `FotoPerfil` text NOT NULL,
  `Tipo_Usuario` varchar(50) DEFAULT NULL,
  `Status` int(11) DEFAULT NULL,
  `DataCadastro` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `PontosRanking` int(11) DEFAULT NULL,
  `TokenRecuperacao` varchar(255) DEFAULT NULL,
  `TokenExpiracao` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`Id_Usuario`, `Nome_Completo`, `Email`, `Telefone`, `Senha`, `DataNascimento`, `Endereco`, `FotoPerfil`, `Tipo_Usuario`, `Status`, `DataCadastro`, `PontosRanking`, `TokenRecuperacao`, `TokenExpiracao`) VALUES
(2, 'Carol Dias do Nascimento', 'carolinedian2@gamail.com', '11999888777', '$2a$10$zPiLrI9L3TLaiWIqqiGLeOyddTbFQiqXI5U.Y9VPuFrwKbt58bEki', '1995-05-15', 'Rua Nova, 456 - São Paulo, SP', '', 'premium', 1, '2025-09-28 23:06:02', 0, NULL, NULL),
(3, 'Andréa Alves dos Santos', 'andrea.santos107@etec.sp.gov.br', '11997798766', '$2b$10$vyIu3oYraJH3op1XfqhfP.ASdU/RY1UF1H7REEyYBPBTDNqOWI0pK', NULL, 'Guarulhos/SP', '1765327489493-297239217.jpg', 'comum', 1, '2025-12-10 00:44:49', 0, NULL, NULL),
(4, 'Raissa Chagas do Carmo', 'raissa.carmo@etec.sp.gov.br', '11945709406', '$2b$10$t6HEbKTVnurRjaQdoCvOhuEgQyf.6xNjliljltOkTFQdfyQWyI4t.', NULL, NULL, '1762903850560-617917778.png', 'comum', 1, '2025-11-11 23:30:50', 0, NULL, NULL),
(5, 'Andrea Alves', 'andrea.alvessantos@outlook.com', NULL, '$2b$10$Z78PQAbXVUw8EnmPMmfTJe79YzW06A3FSqxvnQ419vE5foRHQhbHW', NULL, 'São Paulo/SP', '1764450504332-171117195.png', 'comum', 1, '2025-11-29 21:28:52', 0, NULL, NULL),
(6, 'Raissa Chagas', 'raissachagasdocarmo@gmail.com', NULL, '$2b$10$72UH0Fg1lbFOIKI88aWGUe/R/QdE5qBaqq7nl54JUqRvzKWKj2ht6', NULL, NULL, 'padrao.png', 'comum', 0, '2025-12-09 00:36:52', 0, NULL, NULL),
(7, 'Andrea Gmail', 'deinha.alfa@gmail.com', NULL, '$2b$10$/dF40fnULLbmiW9fNhMmquk44JB73gO.1qShnaFgKwmFFOjsK2SY2', NULL, 'São Paulo/SP', '1765241255994-300781800.jpeg', 'comum', 1, '2025-12-09 00:47:54', 0, NULL, NULL);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`Id_Chat`),
  ADD KEY `Id_Usuario1_FK` (`Id_Usuario1_FK`),
  ADD KEY `Id_Usuario2_FK` (`Id_Usuario2_FK`);

--
-- Índices de tabela `denuncia`
--
ALTER TABLE `denuncia`
  ADD PRIMARY KEY (`Id_Denuncia`),
  ADD KEY `Id_Usuario_Denunciante_FK` (`Id_Usuario_Denunciante_FK`),
  ADD KEY `Id_Usuario_Denunciado_FK` (`Id_Usuario_Denunciado_FK`),
  ADD KEY `Id_Material_FK` (`Id_Material_FK`),
  ADD KEY `Id_Troca_FK` (`Id_Troca_FK`);

--
-- Índices de tabela `material`
--
ALTER TABLE `material`
  ADD PRIMARY KEY (`Id_Material`),
  ADD KEY `Id_Usuario_FK` (`Id_Usuario_FK`);

--
-- Índices de tabela `mensagem`
--
ALTER TABLE `mensagem`
  ADD PRIMARY KEY (`Id_Mensagem`),
  ADD KEY `Id_Chat_FK` (`Id_Chat_FK`),
  ADD KEY `Id_Usuario_Rementente_FK` (`Id_Usuario_Remetente_FK`);

--
-- Índices de tabela `notificacao`
--
ALTER TABLE `notificacao`
  ADD PRIMARY KEY (`Id_Notificacao`),
  ADD KEY `Id_Usuario_FK` (`Id_Usuario_FK`);

--
-- Índices de tabela `recomendacao`
--
ALTER TABLE `recomendacao`
  ADD PRIMARY KEY (`Id_Recomendacao`),
  ADD KEY `Id_Usuario_FK` (`Id_Usuario_FK`),
  ADD KEY `Id_Material_FK` (`Id_Material_FK`);

--
-- Índices de tabela `troca`
--
ALTER TABLE `troca`
  ADD PRIMARY KEY (`Id_Troca`),
  ADD KEY `Id_Material_FK` (`Id_Material_FK`),
  ADD KEY `Id_Usuario_Solicitante_FK` (`Id_Usuario_Solicitante_FK`),
  ADD KEY `Id_Usuario_Doador_FK` (`Id_Usuario_Doador_FK`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`Id_Usuario`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `chat`
--
ALTER TABLE `chat`
  MODIFY `Id_Chat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `denuncia`
--
ALTER TABLE `denuncia`
  MODIFY `Id_Denuncia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `material`
--
ALTER TABLE `material`
  MODIFY `Id_Material` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de tabela `mensagem`
--
ALTER TABLE `mensagem`
  MODIFY `Id_Mensagem` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de tabela `notificacao`
--
ALTER TABLE `notificacao`
  MODIFY `Id_Notificacao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de tabela `recomendacao`
--
ALTER TABLE `recomendacao`
  MODIFY `Id_Recomendacao` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `troca`
--
ALTER TABLE `troca`
  MODIFY `Id_Troca` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `Id_Usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`Id_Usuario1_FK`) REFERENCES `usuario` (`Id_Usuario`),
  ADD CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`Id_Usuario2_FK`) REFERENCES `usuario` (`Id_Usuario`);

--
-- Restrições para tabelas `denuncia`
--
ALTER TABLE `denuncia`
  ADD CONSTRAINT `denuncia_ibfk_1` FOREIGN KEY (`Id_Usuario_Denunciante_FK`) REFERENCES `usuario` (`Id_Usuario`),
  ADD CONSTRAINT `denuncia_ibfk_2` FOREIGN KEY (`Id_Usuario_Denunciado_FK`) REFERENCES `usuario` (`Id_Usuario`),
  ADD CONSTRAINT `denuncia_ibfk_3` FOREIGN KEY (`Id_Material_FK`) REFERENCES `material` (`Id_Material`),
  ADD CONSTRAINT `denuncia_ibfk_4` FOREIGN KEY (`Id_Troca_FK`) REFERENCES `troca` (`Id_Troca`);

--
-- Restrições para tabelas `material`
--
ALTER TABLE `material`
  ADD CONSTRAINT `material_ibfk_1` FOREIGN KEY (`Id_Usuario_FK`) REFERENCES `usuario` (`Id_Usuario`);

--
-- Restrições para tabelas `mensagem`
--
ALTER TABLE `mensagem`
  ADD CONSTRAINT `mensagem_ibfk_1` FOREIGN KEY (`Id_Chat_FK`) REFERENCES `chat` (`Id_Chat`),
  ADD CONSTRAINT `mensagem_ibfk_2` FOREIGN KEY (`Id_Usuario_Remetente_FK`) REFERENCES `usuario` (`Id_Usuario`);

--
-- Restrições para tabelas `notificacao`
--
ALTER TABLE `notificacao`
  ADD CONSTRAINT `notificacao_ibfk_1` FOREIGN KEY (`Id_Usuario_FK`) REFERENCES `usuario` (`Id_Usuario`);

--
-- Restrições para tabelas `recomendacao`
--
ALTER TABLE `recomendacao`
  ADD CONSTRAINT `recomendacao_ibfk_1` FOREIGN KEY (`Id_Usuario_FK`) REFERENCES `usuario` (`Id_Usuario`),
  ADD CONSTRAINT `recomendacao_ibfk_2` FOREIGN KEY (`Id_Material_FK`) REFERENCES `material` (`Id_Material`);

--
-- Restrições para tabelas `troca`
--
ALTER TABLE `troca`
  ADD CONSTRAINT `troca_ibfk_1` FOREIGN KEY (`Id_Material_FK`) REFERENCES `material` (`Id_Material`),
  ADD CONSTRAINT `troca_ibfk_2` FOREIGN KEY (`Id_Usuario_Solicitante_FK`) REFERENCES `usuario` (`Id_Usuario`),
  ADD CONSTRAINT `troca_ibfk_3` FOREIGN KEY (`Id_Usuario_Doador_FK`) REFERENCES `usuario` (`Id_Usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
