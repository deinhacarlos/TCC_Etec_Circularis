import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import styles from '../styles/TermosStyles';

export default function TermosScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.sectionTitle}>
        1. Aceitação dos Termos</Text>
      <Text style={styles.sectionText}>
        Ao acessar e usar a plataforma Circularis, você concorda em cumprir 
        os termos e condições de uso da aplicação.
      </Text>

      <Text style={styles.sectionTitle}>
        2. Descrição do Serviço
      </Text>
      <Text style={styles.sectionText}>
        A Circularis é uma plataforma gratuita para troca de livros e materiais 
        escolares entre usuários, com foco em compartilhamento de conhecimento e sustentabilidade.
      </Text>

      <Text style={styles.sectionTitle}>
        3. Cadastro e Conta de Usuário
      </Text>
      <Text style={styles.sectionText}>
        Para utilizar os serviços, é necessário criar uma conta com informações 
        verdadeiras, completas e atualizadas, mantendo a confidencialidade da sua senha.
      </Text>

      <Text style={styles.sectionTitle}>
        4. Responsabilidades do Usuário
      </Text>
      <Text style={styles.sectionText}>
        O uso da plataforma deve ser ético e legal, sem publicação de conteúdo 
        ofensivo, ilegal ou que viole direitos de terceiros.
      </Text>

      <Text style={styles.sectionTitle}>
        5. Trocas de Livros
      </Text>
      <Text style={styles.sectionText}>
        As trocas são realizadas diretamente entre usuários; a Circularis não se 
        responsabiliza pela qualidade, condição ou entrega dos materiais.
      </Text>

      <Text style={styles.sectionTitle}>
        6. Propriedade Intelectual
      </Text>
      <Text style={styles.sectionText}>
        Conteúdos de design, logotipos e código da plataforma são protegidos por 
        direitos autorais e pertencem à Circularis.
      </Text>

      <Text style={styles.sectionTitle}>
        7. Modificações dos Termos
      </Text>
      <Text style={styles.sectionText}>
        A Circularis pode atualizar estes termos a qualquer momento, com vigência 
        a partir da publicação na aplicação.
      </Text>

      <Text style={styles.sectionTitle}>
        8. Contato
      </Text>
      <Text style={styles.sectionText}>
        Em caso de dúvidas sobre os termos, entre em contato pelo
        e-mail projetocircularis@gmail.com
      </Text>
    </ScrollView>
  );
}
