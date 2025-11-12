import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    const handleLogin = () => {
        fetch('http://localhost:3000/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // navegue para a próxima tela, salve token, etc
                    setErro('');
                } else {
                    setErro('Login inválido');
                }
            })
            .catch(() => setErro('Erro na comunicação com servidor'));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
            />
            <Button title="Entrar" onPress={handleLogin} />
            {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        padding: 16 
    },
    title: { 
        fontSize: 24, 
        marginBottom: 20 
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#999', 
        borderRadius: 8, 
        padding: 10, 
        marginBottom: 14
    },
    erro: { 
        color: 'red', marginTop: 8 }
});
