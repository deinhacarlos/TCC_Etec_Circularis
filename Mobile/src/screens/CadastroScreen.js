// src/screens/CadastroScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  TextInput 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/CadastroStyles';
import { apiPostPublic, saveToken } from '../Api';
import { colors } from '../styles/colors';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);

  // Estado para mensagem de erro customizada
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    // Validação básica
    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não conferem.');
      return;
    }

    setLoading(true);
    setErro(''); // Limpa erro anterior ao tentar enviar

    try {
      const res = await apiPostPublic('/usuarios/cadastro', {
        Nome: nome,
        Email: email,
        Senha: senha,
      });

      if (res?.token) {
        // Sucesso: Aqui mantemos o Alert ou Toast pois é uma transição de sucesso
        await saveToken(res.token);
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
            { text: 'OK', onPress: () => navigation.navigate('Home') }
        ]);
      } else {
        // Erro vindo da API (Ex: Email já existe)
        const msg = res?.message || res?.erro || 'Não foi possível realizar o cadastro.';
        setErro(msg);
      }
    } catch (error) {
      setErro('Falha na conexão com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para limpar erro ao digitar
  const limparErro = () => {
    if (erro) setErro('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../../assets/bannerCadastro.png')}
        style={styles.heroImage}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>Crie sua conta</Text>
        <Text style={styles.subtitle}>
          Ao criar uma conta, você concorda com os{' '}
          <Text 
            style={styles.linkText}
            onPress={() => navigation.navigate('Termos')}
          >
            Termos
          </Text> e{' '}
          <Text 
            style={styles.linkText}
            onPress={() => navigation.navigate('Privacidade')}
          >
            Política de privacidade
          </Text>.
        </Text>

        {/* Nome */}
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={(t) => { setNome(t); limparErro(); }}
          placeholder="Seu nome completo"
          placeholderTextColor="#999"
        />

        {/* E-mail */}
        <Text style={styles.label}>Endereço de E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(t) => { setEmail(t); limparErro(); }}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="seuemail@exemplo.com"
          placeholderTextColor="#999"
        />

        {/* Campo Senha */}
        <Text style={styles.label}>Senha</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            value={senha}
            onChangeText={(t) => { setSenha(t); limparErro(); }}
            secureTextEntry={!senhaVisivel}
            style={styles.inputPassword}
            placeholder="Sua senha"
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            onPress={() => setSenhaVisivel(!senhaVisivel)}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'} 
              size={24} 
              color={colors.grayText} 
            />
          </TouchableOpacity>
        </View>

        {/* Campo Confirmar Senha */}
        <Text style={styles.label}>Confirme a Senha</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            value={confirmarSenha}
            onChangeText={(t) => { setConfirmarSenha(t); limparErro(); }}
            secureTextEntry={!confirmarSenhaVisivel}
            style={styles.inputPassword}
            placeholder="Repita a senha"
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            onPress={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={confirmarSenhaVisivel ? 'eye-off-outline' : 'eye-outline'} 
              size={24} 
              color={colors.grayText} 
            />
          </TouchableOpacity>
        </View>

        {/* MENSAGEM DE ERRO (Só aparece se houver erro) */}
        {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

        <TouchableOpacity
          style={styles.cadastrarButton}
          onPress={handleCadastro}
          disabled={loading}
        >
          <Text style={styles.cadastrarButtonText}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerText}>
            Já possui uma conta?{' '}
            <Text style={styles.footerLink}>Faça login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}