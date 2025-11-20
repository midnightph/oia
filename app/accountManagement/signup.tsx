import colors from '@/components/colors';
import auth from '@/database/firebaseConfig';
import { Feather } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { MotiView } from 'moti';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { sendEmailVerification } from "firebase/auth";
import { router } from 'expo-router';

export default function Signup() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [secure, setSecure] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    async function signup(name: string, email: string, password: string) {
        setIsLoading(true)
        function validarSenha(password: string) {
            const temMaiuscula = /[A-Z]/.test(password);
            const temMinuscula = /[a-z]/.test(password);
            const temNumero = /[0-9]/.test(password);
            const temEspecial = /[^A-Za-z0-9]/.test(password);
            const tamanhoOK = password.length >= 8;

            if (!tamanhoOK) return "A senha deve ter no mínimo 8 caracteres.";
            if (!temMaiuscula) return "A senha deve ter pelo menos uma letra maiúscula.";
            if (!temMinuscula) return "A senha deve ter pelo menos uma letra minúscula.";
            if (!temNumero) return "A senha deve ter pelo menos um número.";
            if (!temEspecial) return "A senha deve ter pelo menos um caractere especial.";

            return null;
        }

        if (validarSenha(password)) {
            alert(validarSenha(password))
            setIsLoading(false)
            return
        }

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                sendEmailVerification(auth.currentUser);
                Alert.alert('Cadastro realizado! Verifique seu email para confirmar o cadastro.', '', [{ text: 'OK', onPress: () => router.push('/accountManagement/login') }])
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });
        setIsLoading(false)
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'timing', duration: 1000 }}>
                <Text style={styles.title}>Criar conta</Text>
                <TextInput placeholder="Nome" style={styles.input} value={name} onChangeText={setName} />
                <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <TextInput placeholder="Senha" style={[styles.input, { width: '70%' }]} secureTextEntry={secure} value={password} onChangeText={setPassword} />
                    <TouchableOpacity onPress={() =>
                        setSecure(!secure)} style={styles.eyeButton}>
                        <Feather name={secure ? 'eye' : 'eye-off'} size={20} color={colors.title} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={{
                    height: 45,
                    width: '80%',
                    borderWidth: 1,
                    borderColor: colors.title,
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.title
                }}
                    disabled={isLoading} onPress={() => signup(name, email, password)}>
                    {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ alignSelf: 'center', color: '#fff', fontSize: 16, fontWeight: '600' }}>Cadastrar</Text>}
                </TouchableOpacity>
            </MotiView >
        </View >
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.title,
        paddingBottom: 16,
        alignSelf: 'center'
    },
    input: {
        height: 45,
        width: '80%',
        borderWidth: 1,
        borderColor: colors.title,
        borderRadius: 16,
        paddingHorizontal: 16,
        marginBottom: 16,
        alignSelf: 'center'
    },
    eyeButton: {
        paddingHorizontal: 6,
        marginBottom: 16,
    },
});
