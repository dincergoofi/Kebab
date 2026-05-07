import Icon from "./Icon.jsx";

const NAV_ICON_MAP = {
  menu: "mains",
  delivery: "location",
  game: "play",
  feedback: "star"
};

export default function BottomNav({ copy, gameEnabled, activeId, onNavigate }) {
  const items = [
    { id: "menu", label: copy.navMenu },
    { id: "delivery", label: copy.navOrder },
    ...(gameEnabled ? [{ id: "game", label: copy.navGame }] : []),
    { id: "feedback", label: copy.navRate }
  ];

  return (
    <nav className={`bottom-nav ${gameEnabled ? "has-game" : "no-game"}`} aria-label="Quick navigation">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={activeId === item.id ? "is-active" : ""}
          onClick={() => onNavigate(item.id)}
          aria-current={activeId === item.id ? "page" : undefined}
        >
          <span>
            <Icon name={NAV_ICON_MAP[item.id]} size={22} />
          </span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
