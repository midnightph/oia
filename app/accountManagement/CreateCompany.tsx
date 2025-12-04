import colors from "@/components/colors";
import { db } from "@/database/firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CreateCompany() {

    const { userId } = useLocalSearchParams();

    const [companyName, setCompanyName] = useState('');
    const [cnpj, setCnpj] = useState('');

    function maskCNPJ(value: string) {
        let cleaned = value.replace(/\D/g, '');
        cleaned = cleaned.slice(0, 14); // impede apagar tudo

        const match = cleaned.match(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})$/);

        if (!match) return value; // mantém o valor caso dê algo inesperado

        const [, p1, p2, p3, p4, p5] = match;
        let formatted = '';
        if (p1) formatted += p1;
        if (p2) formatted += '.' + p2;
        if (p3) formatted += '.' + p3;
        if (p4) formatted += '/' + p4;
        if (p5) formatted += '-' + p5;

        return formatted;
    }


    async function createCompany(companyName: string, cnpj: string) {
        if (!companyName || !cnpj || cnpj.length < 14) {
            alert("Por favor, preencha todos os campos.");
            return;
        }
        let name = companyName.toLowerCase()
        const cleanedCnpj = cnpj.replace(/\D/g, '');
        await addDoc(collection(db, "companies"), {
            name,
            cnpj: cleanedCnpj,
        });
        await setDoc(doc(db, "users", userId as string), {
            companyId: companyName,
            role: 'owner'
        }, { merge: true });

        router.replace('/(tabs)/home');
    }

    return (
        <View>
            <Text>Criar Empresa</Text>
            {/* Formulário para criar empresa */}
            <TextInput placeholder="Nome da empresa" style={styles.input} value={companyName} onChangeText={setCompanyName} />
            <TextInput placeholder="XX.XXX.XXX/XXXX-XX" style={styles.input} value={cnpj} onChangeText={(text) => setCnpj(maskCNPJ(text))} />

            <TouchableOpacity style={{
                height: 45,
                width: '80%',
                borderWidth: 1,
                borderColor: colors.title,
                borderRadius: 16,
                paddingHorizontal: 16,
                marginBottom: 16,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.title
            }}
                onPress={() => createCompany(companyName, cnpj)}>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Criar Empresa</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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