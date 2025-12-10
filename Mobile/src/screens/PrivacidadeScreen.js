import React from 'react';
import { ScrollView, Text } from 'react-native';
import styles from '../styles/PrivacidadeStyles';


export default function PrivacidadeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.sectionTitle}>
        1. Coleta de Informações
      </Text>
      <Text style={styles.sectionText}>
        São coletadas informações fornecidas no cadastro, como nome, e-mail, localização e dados sobre os livros cadastrados para troca.
      </Text>

      <Text style={styles.sectionTitle}>
        2. Uso das Informações
      </Text>
      <Text style={styles.sectionText}>
        Os dados são utilizados para operar e melhorar a plataforma, facilitar trocas entre usuários, enviar notificações e manter a segurança do sistema.
      </Text>

      <Text style={styles.sectionTitle}>
        3. Compartilhamento de Informações
      </Text>
      <Text style={styles.sectionText}>
        Não há venda ou aluguel de dados pessoais; apenas o necessário é compartilhado para viabilizar trocas, como nome e localização geral.
      </Text>

      <Text style={styles.sectionTitle}>
        4. Segurança dos Dados
      </Text>
      <Text style={styles.sectionText}>
        São aplicadas medidas de segurança para proteger as informações contra acessos não autorizados, alterações ou destruição.
      </Text>

      <Text style={styles.sectionTitle}>
        5. Cookies e Tecnologias Similares
      </Text>
      <Text style={styles.sectionText}>
        Tecnologias de rastreio podem ser usadas para melhorar a experiência do usuário, lembrar preferências e analisar o uso da plataforma.
      </Text>

      <Text style={styles.sectionTitle}>
        6. Seus Direitos
      </Text>
      <Text style={styles.sectionText}>
        Você pode acessar, corrigir ou solicitar exclusão dos seus dados pessoais pelas configurações da conta.
      </Text>

      <Text style={styles.sectionTitle}>
        7. Menores de Idade
      </Text>
      <Text style={styles.sectionText}>
        A plataforma é destinada a maiores de 13 anos; recomenda-se supervisão de um responsável para menores de 18 anos.
      </Text>

      <Text style={styles.sectionTitle}>
        8. Alterações na Política
      </Text>
      <Text style={styles.sectionText}>
        Esta política pode ser atualizada periodicamente, com aviso em caso de mudanças significativas.
      </Text>

      <Text style={styles.sectionTitle}>
        9. Contato
      </Text>
      <Text style={styles.sectionText}>
        Dúvidas sobre privacidade podem ser enviadas para projetocircularis@gmail.com
      </Text>
    </ScrollView>
  );
}
