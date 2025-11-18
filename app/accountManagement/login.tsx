import colors from '@/components/colors';
import { Feather } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [secure, setSecure] = useState(false)

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
                }}>
                    <Text style={{ alignSelf: 'center', color: '#fff', fontSize: 16, fontWeight: '600' }}>Entrar</Text>
                </TouchableOpacity>
                <Text style={{ alignSelf: 'center', marginTop: 16, color: colors.title, fontSize: 16, fontWeight: '600' }}>Esqueceu sua senha?</Text>
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