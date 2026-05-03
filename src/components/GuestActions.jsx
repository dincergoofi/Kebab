export default function GuestActions({ copy, gameEnabled }) {
  return (
    <nav className="menu-shortcuts" aria-label="Table shortcuts">
      <a href="#feedback">{copy.rateExperience}</a>
      <a href="#feedback">{copy.quickSupport}</a>
      {gameEnabled ? <a href="#game">{copy.playGame}</a> : null}
    </nav>
  );
}
