import colors from '@/components/colors';
import { db } from '@/database/firebaseConfig';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function ExistingCompany() {

    const [companyName, setCompanyName] = useState('');

    async function searchCompany(companyName: string) {
        const q = query(collection(db, "companies"), where("name", "==", companyName));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    }   

    useEffect(() => {
        if (companyName.length > 2) {
            searchCompany(companyName);
            console.log("Searching for company:", companyName);
        }
    }, [companyName]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Procurar empresas</Text>
            <TextInput placeholder="Nome da empresa" style={styles.input} value={companyName} onChangeText={setCompanyName} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.title,
        marginBottom: 20,
    },
    input: {
    borderWidth: 1,
    borderColor: colors.title,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
})