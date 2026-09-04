"use client";

import { useEffect, useState } from "react";

export default function InstallAppButton() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  if (!installPrompt) {
    return null;
  }

  const handleInstall = async () => {
    const promptEvent = installPrompt;

    await promptEvent.prompt();

    const { outcome } = await promptEvent.userChoice;

    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="
        mt-4
        inline-flex
        items-center
        justify-center
        gap-2
        border
        border-white/40
        bg-white/10
        px-6
        py-2.5
        rounded-xl
        text-sm
        font-medium
        text-white
        backdrop-blur-sm
        transition
        hover:bg-white/20
        hover:border-white/60
      "
    >
      <span>📱</span>
      <span>Instaliraj Kodić</span>
    </button>
  );
}