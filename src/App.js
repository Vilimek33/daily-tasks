import { useState } from "react";

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f9f9f9",
    display: "flex",
    justifyContent: "center",
    paddingTop: "60px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "520px",
    padding: "0 16px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "24px",
    textAlign: "center",
  },
  inputRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "32px",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    fontSize: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    backgroundColor: "#fff",
  },
  button: {
    padding: "10px 18px",
    fontSize: "15px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  taskItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "#1a1a1a",
  },
  taskText: (done) => ({
    fontSize: "15px",
    color: done ? "#aaa" : "#1a1a1a",
    textDecoration: done ? "line-through" : "none",
    transition: "all 0.2s",
  }),
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const pridejTask = () => {
    if (inputValue.trim() === "") return;
    const novyTask = {
      id: Date.now(),
      text: inputValue.trim(),
      hotovo: false,
    };
    setTasks([...tasks, novyTask]);
    setInputValue("");
  };

  const prepniTask = (id) => {
    setTasks(tasks.map((t) =>
      t.id === id ? { ...t, hotovo: !t.hotovo } : t
    ));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") pridejTask();
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Dnešní tasky</h1>

        <div style={styles.inputRow}>
          <input
            style={styles.input}
            type="text"
            placeholder="Nový task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button style={styles.button} onClick={pridejTask}>
            Přidat
          </button>
        </div>

        <div>
          {tasks.length === 0 && (
            <p style={{ color: "#bbb", textAlign: "center", fontSize: "14px" }}>
              Zatím žádné tasky. Přidej první!
            </p>
          )}
          {tasks.map((task) => (
            <div key={task.id} style={styles.taskItem}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={task.hotovo}
                onChange={() => prepniTask(task.id)}
              />
              <span style={styles.taskText(task.hotovo)}>{task.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}