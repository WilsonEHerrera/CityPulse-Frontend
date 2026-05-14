export default function Spinner() {
  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span
        style={{
          display: "inline-block",
          width: 13,
          height: 13,
          border: "2px solid #e5e5e3",
          borderTopColor: "#1a1a1a",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
          flexShrink: 0,
        }}
      />
    </>
  );
}
