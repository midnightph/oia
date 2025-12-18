import colors from '@/components/colors';
import auth, { db } from '@/database/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
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
import Svg, { Circle } from 'react-native-svg';

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
  const [userRole, setUserRole] = useState<'owner' | 'employee' | 'waitingConfirmation' | 'supervisor'>('employee');
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

  const totalTasks = 10;
  const completedTasks = 6;

  const percentage = totalTasks === 0
    ? 0
    : Math.round((completedTasks / totalTasks) * 100);

  const radius = 34;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (circumference * percentage) / 100;

  // cor dinâmica baseada na porcentagem
  const getProgressColor = () => {
    if (percentage < 40) return '#E74C3C'; // vermelho
    if (percentage < 70) return '#F1C40F'; // amarelo
    return '#2ECC71'; // verde
  };


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

  if (userRole === 'waitingConfirmation') {
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
            params: { userName: userName }
          })}>
          <Text style={{ color: colors.title, fontSize: 16, fontWeight: '600' }}>Sua empresa já existe?</Text>
        </TouchableOpacity>

      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
          <Ionicons name="menu-outline" size={40} color={colors.title} />
          <Ionicons name="person-circle-outline" size={40} color={colors.title} />
        </View>
        <Text style={styles.companyName}>
          {companyId.replace(/\b\w/g, char => char.toUpperCase())}
        </Text>
        <Text style={styles.welcome}>
          Bem-vindo, {userName.split(' ').slice(0, 2).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
        </Text>
      </View>

      {/* EMPLOYEE */}
      {userRole === 'employee' && (
        <View style={[styles.container, { padding: 0 }]}>
          <TouchableOpacity style={styles.fullcard}>

            {/* Texto */}
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Tarefas de Hoje</Text>

              <Text style={styles.cardSubtitle}>
                {completedTasks} de {totalTasks} concluídas
              </Text>
            </View>

            {/* Gráfico */}
            <View style={{ width: 90, height: 90, position: 'relative' }}>
              <Svg width={90} height={90}>
                {/* Fundo */}
                <Circle
                  stroke="#E0E0E0"
                  cx="45"
                  cy="45"
                  r={radius}
                  strokeWidth={strokeWidth}
                  fill="none"
                />

                {/* Progresso */}
                <Circle
                  stroke={getProgressColor()}
                  cx="45"
                  cy="45"
                  r={radius}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation="-90"
                  origin="45, 45"
                />
              </Svg>

              {/* Porcentagem no centro */}
              <View style={styles.percentageContainer}>
                <Text style={styles.percentageText}>{percentage}%</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

      )}

      {/* SUPERVISOR */}
      {userRole === 'supervisor' && (
        <View style={styles.grid}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Tarefas do Dia</Text>
            <Text style={styles.cardSubtitle}>
              Acompanhar execução
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Funcionários</Text>
            <Text style={styles.cardSubtitle}>
              Ver progresso individual
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Reatribuir Tarefas</Text>
            <Text style={styles.cardSubtitle}>
              Ajustes rápidos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Histórico</Text>
            <Text style={styles.cardSubtitle}>
              Semanal e mensal
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* OWNER / ADMIN */}
      {userRole === 'owner' && (
        <View style={styles.grid}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Dashboard</Text>
            <Text style={styles.cardSubtitle}>
              Visão geral da empresa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Criar Tarefas</Text>
            <Text style={styles.cardSubtitle}>
              Atribuir para funcionários
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Templates</Text>
            <Text style={styles.cardSubtitle}>
              Checklists reutilizáveis
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Funcionários</Text>
            <Text style={styles.cardSubtitle}>
              Aprovar e gerenciar acessos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Histórico</Text>
            <Text style={styles.cardSubtitle}>
              Diário, semanal e mensal
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FB',
  },
  header: {
    marginBottom: 20,
  },
  companyName: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.title,
  },
  welcome: {
    fontSize: 15,
    color: colors.subtitle,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.title,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.subtitle,
    lineHeight: 18,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullcard: {
    width: '95%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  percentageText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.title,
  },
});

