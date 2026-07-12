export default function PlayPage() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#000",
      color: "#22c55e",
      fontFamily: "monospace",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>ACCESS GRANTED</h1>
      <p style={{ fontSize: "1.5rem", opacity: 0.8 }}>The Arcade is under construction...</p>
      
      <div style={{ marginTop: "4rem", opacity: 0.5 }}>
        <p>Check back later for games.</p>
      </div>
    </div>
  );
}
