import Leaderboard from "./Leaderboard.jsx";
import OrderRushGame from "./OrderRushGame.jsx";

export default function GameExperience({ copy, restaurant, leaderboard, language, onStart, onFinish }) {
  return (
    <>
      <div className="section-heading">
        <p className="eyebrow">{copy.gameEyebrow}</p>
        <h2>{copy.gameTitle}</h2>
        <p>{copy.gameLead}</p>
      </div>

      <div className="game-content">
        <OrderRushGame
          language={language}
          copy={copy}
          promoEnabled={Boolean(restaurant.promo_enabled)}
          scoreTarget={restaurant.promo_threshold}
          onStart={onStart}
          onFinish={onFinish}
        />

        <Leaderboard title={copy.leaderboardTitle} entries={leaderboard} />
      </div>
    </>
  );
}
