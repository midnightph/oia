import colors from '@/components/colors';
import auth from '@/database/firebaseConfig';
import { Feather, FontAwesome } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [secure, setSecure] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: process.env.GOOGLE_AUTH_WEB_ID,
        androidClientId: '805384352936-jphdi0qa64isn68fsffgja98bb4scu0a.apps.googleusercontent.com'
    });

    useEffect(() => {
        if (response?.type === "success") {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential);
        }
    }, [response]);

    function googleLogin() {
        promptAsync();
    }



    async function login(email: string, password: string) {
        setIsLoading(true)

        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                if (!user.emailVerified) {
                    return Alert.alert('Verifique seu e-mail para continuar.')
                }
                router.push('/(tabs)/home')
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                switch (errorCode) {
                    case 'auth/invalid-email':
                        return Alert.alert('Email inválido.')
                    case 'auth/wrong-password':
                        return Alert.alert('Senha inválida.')
                    case 'auth/user-not-found':
                        return Alert.alert('Usuário não encontrado.')
                    case 'auth/invalid-login-credentials':
                        return Alert.alert('Senha inválida.')
                }
            })

        setIsLoading(false)
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'timing', duration: 1000 }}>
                <Text style={styles.title}>Entre na sua conta</Text>
                <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <TextInput placeholder="Senha" style={[styles.input, { width: '70%' }]} secureTextEntry={secure} value={password} onChangeText={setPassword} />
                    <TouchableOpacity onPress={() =>
                        setSecure(!secure)} style={styles.eyeButton}>
                        <Feather name={secure ? 'eye' : 'eye-off'} size={20} color={colors.title} />
                    </TouchableOpacity>
                </View>

                <View style={{ justifyContent: 'center', gap: 12, flexDirection: 'row', width: '82%', alignSelf: 'center' }}>
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
                        onPress={() => login(email, password)}
                        disabled={isLoading}>
                        {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ alignSelf: 'center', color: '#fff', fontSize: 16, fontWeight: '600' }}>Entrar</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignContent: 'center',
                        }} onPress={googleLogin}>
                        <FontAwesome name="google" size={24} color={colors.title} />
                    </TouchableOpacity>
                </View>
                <Text onPress={() => router.push('/accountManagement/forgotPassword')} style={{ alignSelf: 'center', marginTop: 16, color: colors.title, fontSize: 16, fontWeight: '600' }}>Esqueceu sua senha?</Text>
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