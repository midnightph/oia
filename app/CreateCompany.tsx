import colors from "@/components/colors";
import { db } from "@/database/firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";
import { addDoc, collection, doc, setDoc} from "firebase/firestore";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";

export default function CreateCompany() {

    const { userId } = useLocalSearchParams();

    const [companyName, setCompanyName] = useState('');
    const [cnpj, setCnpj] = useState('');

    async function createCompany(companyName: string, cnpj: string) {
        await addDoc(collection(db, "companies"), {
            name: companyName,
            cnpj: cnpj,
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
            <TextInput placeholder="CNPJ" style={styles.input} value={cnpj} onChangeText={setCnpj} />

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