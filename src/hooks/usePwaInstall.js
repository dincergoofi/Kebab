import { useEffect, useMemo, useState } from "react";

const DISMISS_KEY = "realKebabInstallDismissed";

function getInitialDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === "true";
  } catch {
    return false;
  }
}

function detectStandalone() {
  return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;
}

export function usePwaInstall() {
  const [installEvent, setInstallEvent] = useState(null);
  const [dismissed, setDismissed] = useState(getInitialDismissed);
  const [isInstalled, setIsInstalled] = useState(() => detectStandalone());

  useEffect(() => {
    function handleBeforeInstallPrompt(event) {
      event.preventDefault();
      setInstallEvent(event);
    }

    function handleInstalled() {
      setIsInstalled(true);
      setInstallEvent(null);
      try {
        localStorage.removeItem(DISMISS_KEY);
      } catch {
        return;
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const canInstall = useMemo(() => Boolean(installEvent) && !dismissed && !isInstalled, [dismissed, installEvent, isInstalled]);

  async function promptInstall() {
    if (!installEvent) {
      return false;
    }

    await installEvent.prompt();
    const choice = await installEvent.userChoice;

    if (choice.outcome === "accepted") {
      setIsInstalled(true);
      setInstallEvent(null);
      return true;
    }

    return false;
  }

  function dismissInstallPrompt() {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "true");
    } catch {
      return;
    }
  }

  return {
    canInstall,
    isInstalled,
    promptInstall,
    dismissInstallPrompt
  };
}
