import colors from '@/components/colors';
import auth, { db } from '@/database/firebaseConfig';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  doc,
  getDoc,
  Timestamp
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface Task {
  id: string;
  name: string;
  responsibleEmail: string;
  time: string;
  requirements: string;
  status: 'pending' | 'completed';
  createdAt: Timestamp;
}

interface Employee {
  id: string;
  email: string;
  name: string;
  addedBy: string;
  companyId?: string | null;
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'owner' | 'employee' | 'waitingConfirmation'>('employee');
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Fetch user role
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const role = userDoc.data().role || 'employee';
          setCompanyId(userDoc.data().companyId || null);
          setUserRole(role);
          setUserName(userDoc.data().name || '');
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribeAuth;
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.title} />
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View style={styles.center}>
        <Text>Faça login para acessar.</Text>
      </View>
    );
  }

  if(userRole === 'waitingConfirmation') {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.title, fontSize: 16 }}>Aguardando aprovação da empresa</Text>
      </View>
    );
  }

  if (!companyId) {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.title, marginBottom: 10, fontSize: 16 }}>
          Você ainda não está associado a uma empresa. Deseja criar a sua?
        </Text>

        <TouchableOpacity
          style={{
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
          }}
          onPress={() => {
            router.push({
              pathname: "/accountManagement/CreateCompany",
              params: { userId: currentUser.uid }
            })
          }}>
          <Text style={{ color: colors.title, fontSize: 16, fontWeight: '600' }}>Criar Empresa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
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
          }}
          onPress={() => router.push({
            pathname: '/accountManagement/ExistingCompany',
            params: { userName: userName }})}>
          <Text style={{ color: colors.title, fontSize: 16, fontWeight: '600' }}>Sua empresa já existe?</Text>
        </TouchableOpacity>

      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{companyId.replace(/\b\w/g, char => char.toUpperCase())}</Text>
      <Text style={styles.subtitle}>Bem-vindo, {userName.replace(/\b\w/g, char => char.toUpperCase())}!</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push({
            pathname: '/accountManagement/CompanyDashboard',})}>
          <Text style={styles.buttonText}>Dashboard da Empresa</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.subtitle,
    marginBottom: 20,
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: colors.title,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.title,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: colors.title,
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
});
