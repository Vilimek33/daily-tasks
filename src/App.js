import { useState } from "react";

const dnesek = new Date();
const formatDatum = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const mesice = ["Leden","Únor","Březen","Duben","Květen","Červen","Červenec","Srpen","Září","Říjen","Listopad","Prosinec"];
const dnyTydne = ["Po","Út","St","Čt","Pá","So","Ne"];

export default function App() {
  const [tasky, setTasky] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [vybraneDatum, setVybraneDatum] = useState(formatDatum(dnesek));
  const [kalendarRok, setKalendarRok] = useState(dnesek.getFullYear());
  const [kalendarMesic, setKalendarMesic] = useState(dnesek.getMonth());

  // --- logika tasků ---
  const aktualniTasky = tasky[vybraneDatum] || [];

  const pridejTask = () => {
    if (inputValue.trim() === "") return;
    const novyTask = { id: Date.now(), text: inputValue.trim(), hotovo: false };
    setTasky({ ...tasky, [vybraneDatum]: [...aktualniTasky, novyTask] });
    setInputValue("");
  };

  const prepniTask = (id) => {
    setTasky({
      ...tasky,
      [vybraneDatum]: aktualniTasky.map((t) =>
        t.id === id ? { ...t, hotovo: !t.hotovo } : t
      ),
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") pridejTask();
  };

  // --- logika kalendáře ---
  const prvniDenMesice = new Date(kalendarRok, kalendarMesic, 1);
  const pocetDni = new Date(kalendarRok, kalendarMesic + 1, 0).getDate();

  // pondělí = 0, ... neděle = 6
  let zacatekOffset = prvniDenMesice.getDay() - 1;
  if (zacatekOffset < 0) zacatekOffset = 6;

  const predchoziMesic = () => {
    if (kalendarMesic === 0) { setKalendarMesic(11); setKalendarRok(kalendarRok - 1); }
    else setKalendarMesic(kalendarMesic - 1);
  };

  const dalsiMesic = () => {
    if (kalendarMesic === 11) { setKalendarMesic(0); setKalendarRok(kalendarRok + 1); }
    else setKalendarMesic(kalendarMesic + 1);
  };

  const dnesStr = formatDatum(dnesek);

  const bunky = [];
  for (let i = 0; i < zacatekOffset; i++) bunky.push(null);
  for (let d = 1; d <= pocetDni; d++) bunky.push(d);

  return (
    <div style={styles.page}>

      {/* KALENDÁŘ */}
      <div style={styles.kalendar}>
        <div style={styles.kalendarHeader}>
          <button style={styles.navBtn} onClick={predchoziMesic}>‹</button>
          <span style={styles.mesicNadpis}>{mesice[kalendarMesic]} {kalendarRok}</span>
          <button style={styles.navBtn} onClick={dalsiMesic}>›</button>
        </div>

        <div style={styles.dnyTydneGrid}>
          {dnyTydne.map((d) => (
            <div key={d} style={styles.denTydne}>{d}</div>
          ))}
        </div>

        <div style={styles.dnyGrid}>
          {bunky.map((den, i) => {
            if (den === null) return <div key={`empty-${i}`} />;
            const datumStr = `${kalendarRok}-${String(kalendarMesic + 1).padStart(2, "0")}-${String(den).padStart(2, "0")}`;
            const jeDnes = datumStr === dnesStr;
            const jeVybran = datumStr === vybraneDatum;
            const maTasky = tasky[datumStr] && tasky[datumStr].length > 0;
            return (
              <div
                key={den}
                onClick={() => setVybraneDatum(datumStr)}
                style={{
                  ...styles.denBunka,
                  ...(jeDnes ? styles.dnesek : {}),
                  ...(jeVybran ? styles.vybranDen : {}),
                }}
              >
                {den}
                {maTasky && <span style={styles.tecka} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* TASKY */}
      <div style={styles.obsah}>
        <h1 style={styles.nadpis}>
          {vybraneDatum === dnesStr ? "Dnešní tasky" : vybraneDatum}
        </h1>

        <div style={styles.inputRadek}>
          <input
            style={styles.input}
            type="text"
            placeholder="Nový task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button style={styles.tlacitko} onClick={pridejTask}>Přidat</button>
        </div>

        <div>
          {aktualniTasky.length === 0 && (
            <p style={styles.prazdno}>Žádné tasky pro tento den.</p>
          )}
          {aktualniTasky.map((task) => (
            <div key={task.id} style={styles.taskPolozka}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={task.hotovo}
                onChange={() => prepniTask(task.id)}
              />
              <span style={{ ...styles.taskText, ...(task.hotovo ? styles.hotovo : {}) }}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f9f9f9",
    display: "flex",
    flexDirection: "row",
    fontFamily: "'Segoe UI', sans-serif",
    gap: "0",
  },

  // --- kalendář ---
  kalendar: {
    width: "220px",
    minWidth: "220px",
    backgroundColor: "#fff",
    borderRight: "1px solid #eee",
    padding: "24px 16px",
    boxSizing: "border-box",
  },
  kalendarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  mesicNadpis: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1a1a1a",
  },
  navBtn: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#555",
    padding: "0 4px",
    lineHeight: 1,
  },
  dnyTydneGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    marginBottom: "4px",
  },
  denTydne: {
    fontSize: "10px",
    color: "#aaa",
    textAlign: "center",
    padding: "2px 0",
  },
  dnyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "2px",
  },
  denBunka: {
    position: "relative",
    textAlign: "center",
    padding: "5px 2px",
    fontSize: "12px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#333",
    userSelect: "none",
  },
  dnesek: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
  },
  vybranDen: {
    outline: "2px solid #1a1a1a",
    outlineOffset: "-2px",
  },
  tecka: {
    position: "absolute",
    bottom: "2px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    backgroundColor: "#888",
    display: "block",
  },

  // --- tasky ---
  obsah: {
    flex: 1,
    padding: "60px 48px",
    maxWidth: "560px",
  },
  nadpis: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "24px",
  },
  inputRadek: {
    display: "flex",
    gap: "8px",
    marginBottom: "28px",
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
  tlacitko: {
    padding: "10px 18px",
    fontSize: "15px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  taskPolozka: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "11px 0",
    borderBottom: "1px solid #eee",
  },
  checkbox: {
    width: "17px",
    height: "17px",
    cursor: "pointer",
    accentColor: "#1a1a1a",
  },
  taskText: {
    fontSize: "15px",
    color: "#1a1a1a",
  },
  hotovo: {
    color: "#aaa",
    textDecoration: "line-through",
  },
  prazdno: {
    color: "#bbb",
    fontSize: "14px",
    marginTop: "8px",
  },
};