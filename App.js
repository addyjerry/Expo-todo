import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const API_BASE_URL = "http://dexwin-expo.infy.uk/?i=1";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [editing, setEditing] = useState(null);

  // Fetch Todos
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Create a Todo
  const createTodo = async () => {
    try {
      await axios.post(API_BASE_URL, { title, details });
      setTitle("");
      setDetails("");
      fetchTodos();
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  // Update a Todo
  const updateTodo = async () => {
    try {
      await axios.put(`${API_BASE_URL}/${editing.id}`, { title, details });
      setTitle("");
      setDetails("");
      setEditing(null);
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Delete a Todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todo List</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Details"
        value={details}
        onChangeText={setDetails}
      />
      <Button
        title={editing ? "Update Todo" : "Add Todo"}
        onPress={editing ? updateTodo : createTodo}
      />
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todo}>
            <Text style={styles.todoText}>{item.title}</Text>
            <Text>{item.details}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => { setTitle(item.title); setDetails(item.details); setEditing(item); }}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTodo(item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  todo: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  todoText: { fontSize: 18, fontWeight: "bold" },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  edit: { color: "blue", marginRight: 20 },
  delete: { color: "red" },
});
