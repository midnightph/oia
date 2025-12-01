import colors from '@/components/colors';
import auth, { db } from '@/database/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'owner' | 'employee'>('employee');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);

  // Task form
  const [taskName, setTaskName] = useState('');
  const [taskResponsible, setTaskResponsible] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [taskRequirements, setTaskRequirements] = useState('');

  // Employee form
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeeName, setEmployeeName] = useState('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Fetch user role
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const role = userDoc.data().role || 'employee';
          setUserRole(role);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    // Fetch tasks
    const tasksQuery = collection(db, 'tasks');
    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(tasksData);
    });

    // Fetch employees
    const employeesQuery = collection(db, 'employees');
    const unsubscribeEmployees = onSnapshot(employeesQuery, (snapshot) => {
      const employeesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Employee[];
      setEmployees(employeesData);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeEmployees();
    };
  }, [currentUser]);

  const filteredTasks = userRole === 'owner' ? tasks : tasks.filter(task => task.responsibleEmail === currentUser?.email);

  const addTask = async () => {
    if (!taskName || !taskResponsible || !taskTime || !taskRequirements) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      await addDoc(collection(db, 'tasks'), {
        name: taskName,
        responsibleEmail: taskResponsible,
        time: taskTime,
        requirements: taskRequirements,
        status: 'pending',
        createdAt: Timestamp.now(),
      });
      setTaskModalVisible(false);
      setTaskName('');
      setTaskResponsible('');
      setTaskTime('');
      setTaskRequirements('');
      Alert.alert('Sucesso', 'Tarefa adicionada com sucesso.');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao adicionar tarefa.');
    }
  };

  const addEmployee = async () => {
    if (!employeeEmail || !employeeName) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      await addDoc(collection(db, 'employees'), {
        email: employeeEmail,
        name: employeeName,
        addedBy: currentUser?.uid,
      });
      setEmployeeModalVisible(false);
      setEmployeeEmail('');
      setEmployeeName('');
      Alert.alert('Sucesso', 'Funcionário adicionado com sucesso.');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao adicionar funcionário.');
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskName}>{item.name}</Text>
      <Text>Responsável: {item.responsibleEmail}</Text>
      <Text>Tempo: {item.time}</Text>
      <Text>Requisitos: {item.requirements}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tarefas</Text>

      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={styles.taskList}
      />

      {userRole === 'owner' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setTaskModalVisible(true)}>
            <Text style={styles.buttonText}>Adicionar Tarefa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setEmployeeModalVisible(true)}>
            <Text style={styles.buttonText}>Adicionar Funcionário</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Task Modal */}
      <Modal visible={taskModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Adicionar Tarefa</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome da tarefa"
            value={taskName}
            onChangeText={setTaskName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email do responsável"
            value={taskResponsible}
            onChangeText={setTaskResponsible}
          />
          <TextInput
            style={styles.input}
            placeholder="Tempo estimado"
            value={taskTime}
            onChangeText={setTaskTime}
          />
          <TextInput
            style={styles.input}
            placeholder="Requisitos"
            value={taskRequirements}
            onChangeText={setTaskRequirements}
            multiline
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={addTask}>
              <Text style={styles.buttonText}>Adicionar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setTaskModalVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Employee Modal */}
      <Modal visible={employeeModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Adicionar Funcionário</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do funcionário"
            value={employeeName}
            onChangeText={setEmployeeName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email do funcionário"
            value={employeeEmail}
            onChangeText={setEmployeeEmail}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={addEmployee}>
              <Text style={styles.buttonText}>Adicionar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setEmployeeModalVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    flex: 1,
    marginHorizontal: 5,
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
