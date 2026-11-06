
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  giveawayId: string;
  initialParticipated: boolean;
  isLoggedIn: boolean;
};

export default function ParticipationButton({
  giveawayId,
  initialParticipated,
  isLoggedIn,
}: Props) {
  const router = useRouter();

  const [participated, setParticipated] = useState(initialParticipated);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleParticipate() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (participated || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/giveaways/${giveawayId}/participate`,
        {
          method: "POST",
          credentials: "same-origin",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Došlo je do greške.");
        return;
      }

      setParticipated(true);
      router.refresh();
    } catch {
      setError("Greška pri povezivanju. Pokušaj ponovo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleParticipate}
        disabled={loading || participated}
        className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
          participated
            ? "cursor-default bg-green-100 text-green-800"
            : "bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60"
        }`}
      >
        {loading
          ? "Evidentiram..."
          : participated
            ? "✓ Evidentirano – igrao sam"
            : "Igrao sam"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
