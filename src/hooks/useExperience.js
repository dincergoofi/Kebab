import { useEffect, useState } from "react";
import { DEFAULT_LANGUAGE } from "../config/appConfig.js";
import { loadExperience } from "../services/experienceService.js";
import { detectLanguage } from "../utils/localization.js";

export function useExperience(entryPoint) {
  const [state, setState] = useState({
    status: "loading",
    experience: null,
    language: DEFAULT_LANGUAGE,
    error: null
  });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setState((current) => ({ ...current, status: "loading", error: null }));
        const experience = await loadExperience(entryPoint.restaurantSlug);

        if (cancelled) {
          return;
        }

        setState({
          status: "ready",
          experience,
          language: detectLanguage(experience.restaurant.default_language),
          error: null
        });
      } catch (error) {
        if (!cancelled) {
          setState({
            status: "error",
            experience: null,
            language: DEFAULT_LANGUAGE,
            error: error.message || "Load failed"
          });
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [entryPoint.restaurantSlug]);

  return state;
}
