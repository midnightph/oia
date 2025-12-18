import colors from '@/components/colors';
import MyAlert from '@/components/MyAlert';
import auth, { db } from '@/database/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { addDoc, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ExistingCompany() {

    const { userName } = useLocalSearchParams();

    const [companyName, setCompanyName] = useState('');
    const [searchResults, setSearchResults] = useState<Array<{ id: string, cnpj: string, name: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [modalShown, setModalShown] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<{ id: string, cnpj: string, name: string } | null>(null);

    async function searchCompany(companyName: string) {
        setLoading(true);
        setSearchResults([]); // limpa resultados anteriores
        const q = query(collection(db, "companies"), where("name", ">=", companyName.toLowerCase()));

        const querySnapshot = await getDocs(q);

        const results: Array<{ id: string, cnpj: string, name: string }> = [];
        setSearchResults([]); // limpa resultados anteriores

        querySnapshot.forEach(doc => {
            results.push({
                cnpj: doc.data().cnpj,
                name: doc.data().name,
                id: doc.id,
            });
        });

        setSearchResults(results);
        setLoading(false);
    }

    async function registerAsEmployee() {
        if (!selectedCompany || !auth.currentUser) return;
        setLoading(true);

        await addDoc(collection(db, "companies", selectedCompany.id, "waitingConfirmation"), {
            name: userName,
            role: 'employee',
        });

        await setDoc(doc(db, "users", auth.currentUser.uid), {
            companyId: selectedCompany.name,
            role: 'waitingConfirmation',
        }, { merge: true });

        setLoading(false);
        router.replace('/(tabs)/home');
    } 


    useEffect(() => {
        if (companyName.length > 2) {
            searchCompany(companyName);
        } else {
            setSearchResults([]);
        }
    }, [companyName]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Procurar empresas</Text>
            <TextInput placeholder="Nome da empresa" style={styles.input} value={companyName} onChangeText={setCompanyName} />

            {loading ? (<ActivityIndicator size="large" color="#0000ff" />) : (
                searchResults.map(company => (
                    <TouchableOpacity key={company.cnpj} style={styles.resultContainer}
                        onPress={() => {
                            setModalShown(true)
                            setSelectedCompany(company)
                        }}
                    >
                        <View>
                            <Text style={{ color: colors.title, fontSize: 16 }}>{company.name.replace(/\b\w/g, l => l.toUpperCase())}</Text>
                            <Text style={{ color: colors.subtitle, fontSize: 14 }}>Cnpj: {company.cnpj}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={colors.title} style={{ alignSelf: 'center', marginVertical: 10 }} />
                    </TouchableOpacity>
                ))
            )}

            <MyAlert
                visible={modalShown}
                message="Tem certeza de que deseja selecionar essa empresa?"
                onCancel={() => setModalShown(false)}
                onConfirm={() => {
                    setModalShown(false)
                    registerAsEmployee();
                }}
            />

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
})