import { useEffect, useMemo, useRef, useState } from "react";
import { PLACEHOLDER_IMAGES } from "../config/appConfig.js";
import { repairMojibake } from "../utils/text.js";

const INTRO_COPY = {
  tr: {
    skip: "Gec",
    continue: "Devam",
    scenes: [
      { eyebrow: "ONCE", title: "Hazirlik", note: "Bir sonraki sahne atesin basinda", duration: 2950 },
      { eyebrow: "ATESTE", title: "Doner", note: "Alevden masaya taze kesim", duration: 3600 },
      { eyebrow: "ANINDA", title: "Durum", note: "Sar, kes, servis et", duration: 2200 },
      { eyebrow: "BUZ GIBI", title: "Soguk", note: "Son dokunus masaya gelsin", duration: 1900 }
    ]
  },
  es: {
    skip: "Saltar",
    continue: "Continuar",
    scenes: [
      { eyebrow: "ANTES", title: "Preparacion", note: "La siguiente escena arranca junto al fuego", duration: 2950 },
      { eyebrow: "AL FUEGO", title: "Doner", note: "Corte fresco directo a la mesa", duration: 3600 },
      { eyebrow: "RECIEN HECHO", title: "Rollo", note: "Se arma, se corta y se sirve", duration: 2200 },
      { eyebrow: "MUY FRIA", title: "Bebida", note: "El final fresco para cerrar la escena", duration: 1900 }
    ]
  },
  en: {
    skip: "Skip",
    continue: "Continue",
    scenes: [
      { eyebrow: "FIRST", title: "Prep", note: "The next beat starts right by the flame", duration: 2950 },
      { eyebrow: "ON FIRE", title: "Doner", note: "Fresh cut straight from the flame", duration: 3600 },
      { eyebrow: "MADE NOW", title: "Wrap", note: "Rolled, cut and served hot", duration: 2200 },
      { eyebrow: "ICE COLD", title: "Drinks", note: "A chilled finish for the last beat", duration: 1900 }
    ]
  }
};

const DEFAULT_SCENE_DURATION_MS = 2000;
const EXIT_DURATION_MS = 520;

function pickProductImage(products = [], ids = [], fallback = "") {
  for (const id of ids) {
    const match = products.find((product) => product.id === id && product.image_url);
    if (match?.image_url) {
      return match.image_url;
    }
  }

  return fallback;
}

function SceneMedia({ scene, isActive }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return undefined;
    }

    if (!isActive) {
      video.pause();
      return undefined;
    }

    const startAt = typeof scene.startAt === "number" ? scene.startAt : 0;

    const syncPlayback = () => {
      if (startAt > 0 && Math.abs(video.currentTime - startAt) > 0.15) {
        try {
          video.currentTime = startAt;
        } catch {
          // Ignore seek timing failures until metadata is fully ready.
        }
      }

      const playAttempt = video.play();
      if (playAttempt?.catch) {
        playAttempt.catch(() => {});
      }
    };

    if (video.readyState >= 1) {
      syncPlayback();
    } else {
      video.addEventListener("loadedmetadata", syncPlayback, { once: true });
    }

    return () => {
      video.pause();
      video.removeEventListener("loadedmetadata", syncPlayback);
    };
  }, [isActive, scene.startAt, scene.video]);

  if (scene.video) {
    return (
      <video
        ref={videoRef}
        className="intro-scene-media"
        loop
        muted
        playsInline
        poster={scene.poster || scene.image || ""}
        preload="auto"
        src={scene.video}
        style={{ objectPosition: scene.position }}
      />
    );
  }

  return <img className="intro-scene-media" src={scene.image} alt="" style={{ objectPosition: scene.position }} />;
}

export default function OpeningIntro({ restaurant, products = [], language = "es", onComplete }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const introCopy = INTRO_COPY[language] || INTRO_COPY.es;
  const venueName = repairMojibake(restaurant?.name || "Real Kebab Istanbul");
  const donerPoster = pickProductImage(
    products,
    ["plato-kebab-patatas", "patatas-con-carne", "plato-kebab", "carne-con-arroz"],
    restaurant?.cover_image_url || PLACEHOLDER_IMAGES.foostBoxDark
  );

  const scenes = useMemo(
    () => [
      {
        image: donerPoster,
        video: PLACEHOLDER_IMAGES.openingTeaserVideo,
        poster: donerPoster,
        position: "center 48%",
        startAt: 2.85,
        ...introCopy.scenes[0]
      },
      {
        image: donerPoster,
        video: restaurant?.hero_video_url || PLACEHOLDER_IMAGES.openingPrepVideo,
        poster: donerPoster,
        position: "center 54%",
        ...introCopy.scenes[1]
      },
      {
        image: pickProductImage(
          products,
          ["kebab-rollo", "kebab-rollo-menu", "rollo-pequeno", "pizza-kebab"],
          PLACEHOLDER_IMAGES.dishKebabWrapMarble
        ),
        position: "center 52%",
        ...introCopy.scenes[2]
      },
      {
        image: pickProductImage(
          products,
          ["refrescos", "efes", "cerveza", "agua"],
          PLACEHOLDER_IMAGES.drinkSofts
        ),
        position: "center 50%",
        ...introCopy.scenes[3]
      }
    ],
    [donerPoster, introCopy.scenes, products, restaurant?.hero_video_url]
  );

  useEffect(() => {
    if (isLeaving) {
      return undefined;
    }

    const activeScene = scenes[activeIndex];
    const duration = activeScene?.duration || DEFAULT_SCENE_DURATION_MS;

    if (activeIndex >= scenes.length - 1) {
      const completeTimer = window.setTimeout(() => setIsLeaving(true), duration);
      return () => window.clearTimeout(completeTimer);
    }

    const stepTimer = window.setTimeout(() => {
      setActiveIndex((current) => Math.min(current + 1, scenes.length - 1));
    }, duration);

    return () => window.clearTimeout(stepTimer);
  }, [activeIndex, isLeaving, scenes]);

  useEffect(() => {
    if (!isLeaving) {
      return undefined;
    }

    const exitTimer = window.setTimeout(() => {
      onComplete?.();
    }, EXIT_DURATION_MS);

    return () => window.clearTimeout(exitTimer);
  }, [isLeaving, onComplete]);

  function finishIntro() {
    setIsLeaving(true);
  }

  return (
    <section className={`opening-intro${isLeaving ? " is-leaving" : ""}`} aria-label={`${venueName} intro`}>
      {scenes.map((scene, index) => (
        <article
          key={`${scene.title}-${index}`}
          className={`intro-scene${index === activeIndex ? " is-active" : ""}${index < activeIndex ? " is-past" : ""}`}
          aria-hidden={index !== activeIndex}
        >
          <SceneMedia scene={scene} isActive={index === activeIndex} />
          <div className="intro-scene-shade" />
          <div className="intro-scene-copy">
            <span>{scene.eyebrow}</span>
            <strong>{scene.title}</strong>
            <p>{scene.note}</p>
          </div>
        </article>
      ))}

      <div className="intro-topbar">
        <img className="intro-logo" src={restaurant?.logo_image_url || PLACEHOLDER_IMAGES.logoLuxe} alt="" />
        <div>
          <span>{venueName}</span>
        </div>
      </div>

      <div className="intro-progress" aria-hidden="true">
        {scenes.map((scene, index) => (
          <span key={`${scene.title}-progress`} className={index <= activeIndex ? "is-active" : ""} />
        ))}
      </div>

      <div className="intro-actions">
        <button type="button" className="intro-ghost-button" onClick={finishIntro}>
          {introCopy.skip}
        </button>
        <button type="button" className="intro-primary-button" onClick={finishIntro}>
          {introCopy.continue}
        </button>
      </div>
    </section>
  );
}

