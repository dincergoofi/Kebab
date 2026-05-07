import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import AppHeader from "./components/AppHeader.jsx";
import BottomNav from "./components/BottomNav.jsx";
import CategoryDrawer from "./components/CategoryDrawer.jsx";
import DeliveryLinksSection from "./components/DeliveryLinksSection.jsx";
import InstallPrompt from "./components/InstallPrompt.jsx";
import MenuSection from "./components/MenuSection.jsx";
import OpeningIntro from "./components/OpeningIntro.jsx";
import ReputationSection from "./components/ReputationSection.jsx";
import WelcomeCover from "./components/WelcomeCover.jsx";
import { COPY } from "./data/i18n.js";
import { DEFAULT_LANGUAGE } from "./config/appConfig.js";
import { useExperience } from "./hooks/useExperience.js";
import { usePwaInstall } from "./hooks/usePwaInstall.js";
import { useThemePreference } from "./hooks/useThemePreference.js";
import { loadLeaderboard, submitFeedback, submitGameResult } from "./services/experienceService.js";
import { createGuestSession, trackEvent } from "./services/telemetryService.js";
import { parseEntryPoint } from "./utils/routing.js";

const AdminPanel = lazy(() => import("./components/AdminPanel.jsx"));
const GameExperience = lazy(() => import("./components/GameExperience.jsx"));

function StatusFallback({ message }) {
  return (
    <main className="status-screen">
      <p>{message}</p>
    </main>
  );
}

function AdminFallback() {
  return (
    <main className="admin-shell">
      <section className="admin-card">
        <p>Loading admin workspace...</p>
      </section>
    </main>
  );
}

function GameFallback({ copy }) {
  return (
    <>
      <div className="section-heading">
        <p className="eyebrow">{copy.gameEyebrow}</p>
        <h2>{copy.gameTitle}</h2>
        <p>{copy.gameLead}</p>
      </div>

      <div className="game-loading-card">
        <span className="game-loading-glow" />
        <strong>{copy.loading}</strong>
        <p>{copy.gameCardSub}</p>
      </div>
    </>
  );
}

export default function App() {
  const entryPoint = useMemo(() => parseEntryPoint(window.location.pathname), []);
  const introStorageKey = `realKebabIntroSeen:${entryPoint.restaurantSlug || "default"}`;
  const { status, experience, language: detectedLanguage, error } = useExperience(entryPoint);
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [activeMenuCategoryId, setActiveMenuCategoryId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeNavSection, setActiveNavSection] = useState("menu");
  const [shouldLoadGame, setShouldLoadGame] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showOpeningIntro, setShowOpeningIntro] = useState(() => {
    if (entryPoint.isAdminMode) {
      return false;
    }

    try {
      return forceOpeningIntro || sessionStorage.getItem(introStorageKey) !== "1";
    } catch {
      return true;
    }
  });
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("realKebabFavorites") || "[]"));
    } catch {
      return new Set();
    }
  });
  const viewedProducts = useRef(new Set());
  const gameMountRef = useRef(null);
  const { theme, toggleTheme } = useThemePreference();
  const { canInstall, promptInstall, dismissInstallPrompt } = usePwaInstall();

  const copy = COPY[language];

  useEffect(() => {
    setLanguage(detectedLanguage);
  }, [detectedLanguage]);

  useEffect(() => {
    if (experience?.categories?.length) {
      setSelectedCategoryId(experience.categories[0].id);
    }

    if (experience?.leaderboard) {
      setLeaderboard(experience.leaderboard);
    }
  }, [experience]);

  useEffect(() => {
    let cancelled = false;

    async function openSession() {
      if (!experience) {
        return;
      }

      try {
        const nextSessionId = await createGuestSession({
          restaurantSlug: experience.restaurant.slug,
          tableCode: entryPoint.tableCode,
          language: detectedLanguage
        });

        if (!cancelled) {
          setSessionId(nextSessionId);
          await trackEvent({
            sessionId: nextSessionId,
            eventName: "qr_opened",
            metadata: {
              restaurantSlug: experience.restaurant.slug,
              tableCode: entryPoint.tableCode,
              source: experience.source
            }
          });
        }
      } catch {
        if (!cancelled) {
          setSessionId(null);
        }
      }
    }

    openSession();

    return () => {
      cancelled = true;
    };
  }, [detectedLanguage, entryPoint.tableCode, experience]);

  useEffect(() => {
    if (showOpeningIntro) {
      return undefined;
    }

    const sectionIds = ["menu", "delivery", "feedback"];
    if (experience?.restaurant?.is_game_enabled !== false) {
      sectionIds.splice(2, 0, "game");
    }

    const targets = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!targets.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveNavSection(visible.target.id);
        }
      },
      {
        threshold: [0.25, 0.45, 0.65],
        rootMargin: "-20% 0px -35% 0px"
      }
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [experience, showOpeningIntro]);

  useEffect(() => {
    if (showOpeningIntro || !experience || experience.restaurant.is_game_enabled === false || shouldLoadGame) {
      return undefined;
    }

    const target = gameMountRef.current;
    if (!target) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadGame(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "360px 0px"
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [experience, shouldLoadGame, showOpeningIntro]);

  function handleLanguageChange(nextLanguage) {
    setLanguage(nextLanguage);
    try {
      localStorage.setItem("realKebabLanguage", nextLanguage);
    } catch {
      // The selected language still applies for the current visit.
    }
    trackEvent({
      sessionId,
      eventName: "language_selected",
      metadata: { language: nextLanguage }
    });
  }

  function handleCategoryChange(categoryId) {
    setSelectedCategoryId(categoryId);
    trackEvent({
      sessionId,
      eventName: "menu_category_viewed",
      metadata: { categoryId }
    });
  }

  function handleCategoryOpen(categoryId) {
    handleCategoryChange(categoryId);
    setActiveMenuCategoryId(categoryId);
  }

  function handleCategoryClose() {
    setActiveMenuCategoryId(null);
  }

  function scrollToSection(sectionId) {
    if (sectionId === "game") {
      setShouldLoadGame(true);
    }

    setActiveNavSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleProductView(product) {
    if (viewedProducts.current.has(product.id)) {
      return;
    }

    viewedProducts.current.add(product.id);
    trackEvent({
      sessionId,
      eventName: "product_viewed",
      metadata: { productId: product.id, categoryId: product.category_id }
    });
  }

  function handleFavoriteToggle(product) {
    setFavoriteIds((current) => {
      const next = new Set(current);
      const isFavorite = next.has(product.id);

      if (isFavorite) {
        next.delete(product.id);
      } else {
        next.add(product.id);
      }

      try {
        localStorage.setItem("realKebabFavorites", JSON.stringify([...next]));
      } catch {
        // Favorites remain available in memory if storage is blocked.
      }

      trackEvent({
        sessionId,
        eventName: isFavorite ? "favorite_removed" : "favorite_added",
        metadata: { productId: product.id, categoryId: product.category_id }
      });

      return next;
    });
  }

  async function handleFeedbackSubmit({ stars, comment, platform }) {
    const result = await submitFeedback({
      restaurantSlug: experience.restaurant.slug,
      tableCode: entryPoint.tableCode,
      stars,
      comment,
      platform,
      language,
      sessionId
    });

    await trackEvent({
      sessionId,
      eventName: "feedback_submitted",
      metadata: { stars, platform }
    });

    return result;
  }

  async function handleGameFinish({ playerName, score }) {
    const result = await submitGameResult({
      restaurantSlug: experience.restaurant.slug,
      tableCode: entryPoint.tableCode,
      playerName,
      score
    });

    await trackEvent({
      sessionId,
      eventName: "game_finished",
      metadata: { score, promoGenerated: Boolean(result.promo_code) }
    });

    try {
      const latestLeaderboard = await loadLeaderboard(experience.restaurant.slug);
      setLeaderboard(latestLeaderboard);
    } catch {
      appendLeaderboardEntry({
        id: result.leaderboard_id || `local-${Date.now()}`,
        player_name: playerName,
        score,
        created_at: new Date().toISOString()
      });
    }

    return result;
  }

  function appendLeaderboardEntry(entry) {
    setLeaderboard((current) => [entry, ...current].sort((a, b) => b.score - a.score).slice(0, 5));
  }

  function openMenuFromCover() {
    scrollToSection("menu");
    trackEvent({
      sessionId,
      eventName: "welcome_menu_clicked"
    });
  }

  function handleIntroComplete() {
    try {
      sessionStorage.setItem(introStorageKey, "1");
    } catch {
      // Session storage is optional for the intro handoff.
    }

    setShowOpeningIntro(false);
    setActiveNavSection("menu");
    window.scrollTo({ top: 0, behavior: "auto" });
    trackEvent({
      sessionId,
      eventName: "opening_intro_completed",
      metadata: { restaurantSlug: experience?.restaurant?.slug }
    });
  }

  if (entryPoint.isAdminMode) {
    return (
      <div className="app-shell app-shell-admin">
        <Suspense fallback={<AdminFallback />}>
          <AdminPanel restaurantSlug={entryPoint.restaurantSlug} brandRestaurant={experience?.restaurant} />
        </Suspense>
      </div>
    );
  }

  if (status === "error") {
    return (
      <main className="status-screen">
        <p>{error}</p>
        <button type="button" className="primary-button" onClick={() => window.location.reload()}>
          {COPY.tr.retry}
        </button>
      </main>
    );
  }

  if (status !== "ready") {
    return <StatusFallback message={COPY.tr.loading} />;
  }

  const gameEnabled = experience.restaurant.is_game_enabled !== false;
  const activeCategoryId = selectedCategoryId || experience.categories[0]?.id || null;
  const brandTheme = experience.restaurant.theme || {};
  const appThemeVars = {
    "--red": brandTheme.primary || undefined,
    "--yellow": brandTheme.accent || undefined,
    "--green": brandTheme.fresh || undefined
  };

  return (
    <div className="app-shell" style={appThemeVars}>
      {!showOpeningIntro ? (
        <>
          <AppHeader
            restaurant={experience.restaurant}
            tableCode={entryPoint.tableCode}
            language={language}
            copy={copy}
            isDemo={experience.source === "demo"}
            theme={theme}
            onOpenMenu={() => setIsDrawerOpen(true)}
            onLanguageChange={handleLanguageChange}
            onThemeToggle={toggleTheme}
          />

          <CategoryDrawer
            isOpen={isDrawerOpen}
            restaurant={experience.restaurant}
            categories={experience.categories}
            products={experience.products}
            selectedCategoryId={activeCategoryId}
            language={language}
            copy={copy}
            onSelect={(categoryId) => {
              handleCategoryOpen(categoryId);
              setIsDrawerOpen(false);
              scrollToSection("menu");
            }}
            onClose={() => setIsDrawerOpen(false)}
          />
        </>
      ) : null}

      <main>
        {showOpeningIntro ? (
          <OpeningIntro
            restaurant={experience.restaurant}
            products={experience.products}
            language={language}
            onComplete={handleIntroComplete}
          />
        ) : (
          <>
            <WelcomeCover
              restaurant={experience.restaurant}
              products={experience.products}
              language={language}
              copy={copy}
              onLanguageChange={handleLanguageChange}
              onOpenMenu={openMenuFromCover}
            />

            {canInstall ? (
              <InstallPrompt
                language={language}
                onInstall={async () => {
                  const installed = await promptInstall();
                  if (installed) {
                    trackEvent({
                      sessionId,
                      eventName: "pwa_installed",
                      metadata: { restaurantSlug: experience.restaurant.slug }
                    });
                  }
                }}
                onDismiss={dismissInstallPrompt}
              />
            ) : null}

            <MenuSection
              restaurant={experience.restaurant}
              links={experience.links || []}
              categories={experience.categories}
              products={experience.products}
              selectedCategoryId={activeCategoryId}
              activeCategoryId={activeMenuCategoryId}
              language={language}
              copy={copy}
              gameEnabled={gameEnabled}
              favoriteIds={favoriteIds}
              onCategoryChange={handleCategoryChange}
              onCategoryOpen={handleCategoryOpen}
              onCategoryClose={handleCategoryClose}
              onProductView={handleProductView}
              onFavoriteToggle={handleFavoriteToggle}
            />

            <DeliveryLinksSection
              restaurant={experience.restaurant}
              links={experience.links || []}
              language={language}
              onCallOrder={({ phone }) =>
                trackEvent({
                  sessionId,
                  eventName: "phone_order_clicked",
                  metadata: { phone }
                })
              }
            />

            {experience.restaurant.is_feedback_enabled !== false ? (
              <ReputationSection
                restaurant={experience.restaurant}
                language={language}
                copy={copy}
                onSubmitFeedback={handleFeedbackSubmit}
                onTrackEvent={(eventName, metadata) => trackEvent({ sessionId, eventName, metadata })}
              />
            ) : null}

            {gameEnabled ? (
              <section className="game-band" id="game" ref={gameMountRef}>
                {shouldLoadGame ? (
                  <Suspense fallback={<GameFallback copy={copy} />}>
                    <GameExperience
                      copy={copy}
                      restaurant={experience.restaurant}
                      leaderboard={leaderboard}
                      language={language}
                      onStart={() => trackEvent({ sessionId, eventName: "game_started" })}
                      onFinish={async ({ playerName, score }) => {
                        const result = await handleGameFinish({ playerName, score });
                        return result;
                      }}
                    />
                  </Suspense>
                ) : (
                  <GameFallback copy={copy} />
                )}
              </section>
            ) : null}
          </>
        )}
      </main>

      {!showOpeningIntro ? (
        <BottomNav
          copy={copy}
          gameEnabled={gameEnabled}
          activeId={activeNavSection}
          onNavigate={scrollToSection}
        />
      ) : null}
    </div>
  );
}






