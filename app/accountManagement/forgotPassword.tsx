import colors from "@/components/colors";
import auth from "@/database/firebaseConfig";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function recoverPassword(email: string) {
        sendPasswordResetEmail(auth, email)
        .then(() => {
            Alert.alert('Email enviado com sucesso!')
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            switch (errorCode) {
                case 'auth/invalid-email':
                    return Alert.alert('Email inválido.')
                case 'auth/user-not-found':
                    return Alert.alert('Usuário nao encontrado.')
            }
        })
    }

    return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>Esqueci minha senha</Text>
        <Text style={styles.subtitle}>Vamos precisar do seu e-mail para redefinir sua senha</Text>
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
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
                    onPress={() => recoverPassword(email)}
                    disabled={isLoading}>
                    {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ alignSelf: 'center', color: '#fff', fontSize: 16, fontWeight: '600' }}>Mudar senha</Text>}
                </TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.title,
        alignSelf: 'center'
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: colors.title + '90',
        maxWidth: '90%',
        textAlign: 'center',
        paddingBottom: 16
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
});