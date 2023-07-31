import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  FlatList,
  Modal,
  TextInput,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useCallback, useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";

import * as Animatable from "react-native-animatable";

import TaskList from "./src/components/TaskList";

const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App() {
  const [task, setTask] = useState([]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  function handleAdd() {
    if (input === "") return null;

    const data = {
      key: input,
      task: input,
    };

    setTask([...task, data]);
    setOpen(false);
    setInput("");
  }

  const handleDelete = useCallback((data) => {
    const find = task.filter((r) => r.key !== data.key);
    setTask(find);
  });

  // Buscando tarefas ao iniciar o app
  useEffect(() => {
    async function loadTasks() {
      try {
        // Carregar a string JSON do AsyncStorage usando a chave específica
        const taskStorage = await AsyncStorage.getItem("@task");

        // Converter a string JSON de volta para um array de objetos
        const taksLocal = JSON.parse(taskStorage);

        // Atualizar o estado com os dados carregados (ou array vazio se não houver dados salvos)
        setTask(taksLocal || []);
      } catch (error) {
        console.log(error);
      }
    }

    loadTasks();
  }, []);

  // Salvando tarefas
  useEffect(() => {
    async function saveTasks() {
      try {
        // Converter o array para uma string JSON
        const jsonValue = JSON.stringify(task);

        // Salvar a string JSON no AsyncStorage com uma chave específica
        await AsyncStorage.setItem("@task", jsonValue);
      } catch (error) {
        console.log(error);
      }
    }

    saveTasks();
  }, [task]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#171d31" barStyle="light-content" />

      <View style={styles.content}>
        <Text style={styles.title}>Meu APP!</Text>
      </View>

      <FlatList
        showsHorizontalScrollIndicator={false}
        data={task}
        keyExtractor={(item) => String(item.key)}
        renderItem={({ item }) => (
          <TaskList data={item} handleDelete={handleDelete} />
        )}
      />

      <Modal animationType="slide" transparent={false} visible={open}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Ionicons
                name="md-arrow-back"
                size={40}
                color="#fff"
                style={{ marginLeft: 5, marginRight: 5 }}
              />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Nova tarefa</Text>
          </View>

          <Animatable.View
            style={styles.modalBody}
            animation="fadeInUp"
            useNativeDriver
          >
            <TextInput
              multiline={true}
              placeholderTextColor="#747474"
              autoCorrect={false}
              placeholder="O que precisa fazer hoje?"
              style={styles.input}
              value={input}
              onChangeText={(text) => setInput(text)}
            />

            <TouchableOpacity style={styles.handleAdd} onPress={handleAdd}>
              <Text style={styles.handleAddText}>Cadastrar</Text>
            </TouchableOpacity>
          </Animatable.View>
        </SafeAreaView>
      </Modal>

      <AnimatedBtn
        style={styles.fab}
        animation="bounceInUp"
        useNativeDriver
        duration={1500}
        onPress={() => setOpen(true)}
      >
        <Ionicons name="ios-add" size={32} color="#fff" />
      </AnimatedBtn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171d31",
  },
  content: {},
  title: {
    marginTop: 10,
    paddingBottom: 10,
    fontSize: 25,
    textAlign: "center",
    color: "#fff",
  },
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    backgroundColor: "#0094FF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    right: 25,
    bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3,
    },
  },
  modal: {
    flex: 1,
    backgroundColor: "#171d31",
  },
  modalHeader: {
    marginLeft: 10,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    marginLeft: 15,
    fontSize: 23,
    color: "#fff",
  },
  modalBody: {
    marginTop: 15,
  },
  input: {
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    backgroundColor: "#fff",
    padding: 9,
    height: 85,
    textAlignVertical: "top",
    color: "#000",
    borderRadius: 5,
  },
  handleAdd: {
    backgroundColor: "#fff",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 5,
  },
  handleAddText: {
    fontSize: 20,
  },
});
