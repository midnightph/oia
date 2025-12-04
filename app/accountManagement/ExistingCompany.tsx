import colors from '@/components/colors';
import { db } from '@/database/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function ExistingCompany() {

    const [companyName, setCompanyName] = useState('');
    const [searchResults, setSearchResults] = useState<Array<{ cnpj: string, name: string }>>([]);

    async function searchCompany(companyName: string) {
        setSearchResults([]); // limpa resultados anteriores
        const q = query(collection(db, "companies"), where("name", ">=", companyName.toLowerCase()));

        const querySnapshot = await getDocs(q);

        const results: Array<{ cnpj: string, name: string }> = [];
        setSearchResults([]); // limpa resultados anteriores

        querySnapshot.forEach(doc => {
            results.push({
                cnpj: doc.data().cnpj,
                name: doc.data().name
            });
        });

        setSearchResults(results);
    }

    useEffect(() => {
        if (companyName.length > 2) {
            searchCompany(companyName);
            console.log("Searching for company:", companyName);
        } else {
            setSearchResults([]);
        }
    }, [companyName]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Procurar empresas</Text>
            <TextInput placeholder="Nome da empresa" style={styles.input} value={companyName} onChangeText={setCompanyName} />

            {searchResults.map(company => (
                <View key={company.cnpj} style={styles.resultContainer}>
                    <Text style={{ color: colors.title, fontSize: 16 }}>{company.name.replace(/\b\w/g, l => l.toUpperCase())}</Text>
                    <Text style={{ color: colors.subtitle, fontSize: 14 }}>Cnpj: {company.cnpj}</Text>
                </View>
            ))}

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
    resultContainer: {
        padding: 10,
        borderWidth: 1,
        borderColor: colors.title,
        borderRadius: 8,
    },
})