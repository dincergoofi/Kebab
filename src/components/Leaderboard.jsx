export default function Leaderboard({ title, entries }) {
  return (
    <div className="leaderboard-panel">
      <h3>{title}</h3>
      <ol>
        {entries.map((entry) => (
          <li key={entry.id}>
            <span>{entry.player_name}</span>
            <strong>{entry.score}</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}
