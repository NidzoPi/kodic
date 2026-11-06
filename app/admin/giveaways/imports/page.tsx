
"use client";

import { useCallback, useEffect, useState } from "react";

type GiveawayImport = {
  id: string;
  sourcePostId: string;
  sourcePageId: string;
  sourcePageName: string;
  description: string | null;
  imageUrl: string | null;
  originalUrl: string;
  publishedAt: string | null;
  importedAt: string;
};

const inputClass =
  "w-full rounded-lg border border-gray-400 bg-white px-3 py-2.5 text-sm text-gray-950 placeholder:text-gray-500 shadow-sm focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-200";

const labelClass =
  "mb-1.5 block text-sm font-semibold text-gray-900";

function getPostLines(description: string | null) {
  return (description || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function ImportCard({
  item,
  onProcessed,
}: {
  item: GiveawayImport;
  onProcessed: () => void;
}) {
  const postLines = getPostLines(item.description);

  const [title, setTitle] = useState(
    () => postLines[0] || ""
  );
  const [prize, setPrize] = useState("");
  const [organizer, setOrganizer] = useState(
    () => postLines[1] || item.sourcePageName
  );
  const [rules, setRules] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function approve(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const response = await fetch(`/api/admin/giveaway-imports/${item.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          prize,
          organizer,
          rules,
          startsAt,
          endsAt: endsAt || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Greška pri odobravanju objave.");
      }

      onProcessed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Došlo je do greške.");
    } finally {
      setBusy(false);
    }
  }

  async function dismiss() {
    if (!confirm("Da li sigurno želiš odbaciti ovu objavu?")) return;

    setError("");
    setBusy(true);

    try {
      const response = await fetch(`/api/admin/giveaway-imports/${item.id}`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Greška pri odbacivanju objave.");
      }

      onProcessed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Došlo je do greške.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-sm">
      {item.imageUrl && (
        <div className="bg-gray-100">
          <img
            src={item.imageUrl}
            alt="Slika Facebook objave"
            className="max-h-80 w-full object-contain"
          />
        </div>
      )}

      <div className="space-y-5 p-5">
        <div>
          <p className="text-sm font-bold text-purple-800">
            {item.sourcePageName}
          </p>
          <p className="mt-1 text-xs font-medium text-gray-600">
            Objavljeno:{" "}
            {item.publishedAt
              ? new Date(item.publishedAt).toLocaleString("bs-BA")
              : "Nepoznat datum"}
          </p>
        </div>

        <div className="whitespace-pre-wrap text-sm leading-6 text-gray-900">
          {item.description || "Objava nema tekstualni opis."}
        </div>

        <div>
          <a
            href={item.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-purple-800 underline hover:text-purple-950"
          >
            Otvori originalnu Facebook objavu
          </a>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-4 text-base font-bold text-gray-950">
            Podaci za nagradnu igru
          </h3>

          <form onSubmit={approve} className="space-y-4">
            <div>
              <label className={labelClass}>
                Naziv nagradne igre *
              </label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Automatski preuzet prvi red objave"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Nagrada (opcionalno)
              </label>
              <input
                value={prize}
                onChange={(e) => setPrize(e.target.value)}
                placeholder="Može ostati prazno ako je nagrada vidljiva na slici"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Organizator
              </label>
              <input
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="Automatski preuzet drugi red objave"
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Datum početka *</label>
                <input
                  required
                  type="date"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Datum završetka</label>
                <input
                  type="date"
                  min={startsAt || undefined}
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  className={inputClass}
                />
                <p className="mt-1.5 text-xs font-medium text-gray-600">
                  Može ostati prazno ako datum nije poznat.
                </p>
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Pravila nagradne igre
              </label>
              <textarea
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                rows={4}
                placeholder="Unesi pravila ili uslove učestvovanja..."
                className={inputClass + " resize-y"}
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-purple-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-purple-900 disabled:opacity-50"
              >
                {busy ? "Obrada..." : "Odobri i objavi"}
              </button>

              <button
                type="button"
                onClick={dismiss}
                disabled={busy}
                className="rounded-lg border border-red-400 bg-white px-5 py-2.5 text-sm font-bold text-red-800 hover:bg-red-50 disabled:opacity-50"
              >
                Odbaci objavu
              </button>
            </div>
          </form>
        </div>

        <p className="text-xs font-medium text-gray-500">
          Facebook ID objave: {item.sourcePostId}
        </p>
      </div>
    </article>
  );
}

export default function GiveawayImportsPage() {
  const [imports, setImports] = useState<GiveawayImport[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [syncMessage, setSyncMessage] = useState("");

  const loadImports = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/giveaway-imports");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Greška pri učitavanju objava.");
      }

      setImports(data.imports || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Došlo je do greške.");
    } finally {
      setLoading(false);
    }
  }, []);

  async function syncFacebookPosts() {
    setSyncing(true);
    setSyncMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/giveaway-imports/sync", {
        method: "POST",
        credentials: "same-origin",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Greška pri uvozu Facebook objava.");
      }

      setSyncMessage(
        `Uvoz završen! Pronađeno: ${data.fetched}, novih objava: ${data.imported}, preskočeno duplikata: ${data.skipped}.`
      );

      await loadImports();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Došlo je do greške pri uvozu."
      );
    } finally {
      setSyncing(false);
    }
  }

  useEffect(() => {
    loadImports();
  }, [loadImports]);

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-4 text-gray-950 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-950">
            Facebook objave
          </h1>
          <p className="mt-1 text-sm font-medium text-gray-600">
            Pregledaj objave i odaberi koje će postati nagradne igre na Kodicu.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={syncFacebookPosts}
            disabled={syncing || loading}
            className="rounded-lg bg-purple-800 px-4 py-2 text-sm font-bold text-white hover:bg-purple-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {syncing ? "Uvoz u toku..." : "↓ Uvezi Facebook objave"}
          </button>

          <button
            onClick={loadImports}
            disabled={loading || syncing}
            className="rounded-lg border border-gray-400 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 disabled:opacity-50"
          >
            Osvježi listu
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="rounded-xl border border-green-300 bg-green-50 p-4 text-sm font-semibold text-green-900">
          {syncMessage}
        </div>
      )}

      <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
        <p className="text-sm font-semibold text-purple-950">
          {imports.length} objava čeka pregled.
        </p>
      </div>

      {loading && (
        <p className="py-10 text-center text-sm font-medium text-gray-600">
          Učitavanje objava...
        </p>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
          {error}
          <button
            onClick={loadImports}
            className="ml-2 font-bold underline"
          >
            Pokušaj ponovo
          </button>
        </div>
      )}

      {!loading && !error && imports.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-400 p-10 text-center">
          <h2 className="font-bold text-gray-900">
            Nema novih Facebook objava
          </h2>
          <p className="mt-2 text-sm font-medium text-gray-600">
            Kada uvezemo objave putem Graph API-ja, pojaviće se ovdje.
          </p>
        </div>
      )}

      {!loading && !error && imports.length > 0 && (
        <div className="space-y-6">
          {imports.map((item) => (
            <ImportCard
              key={item.id}
              item={item}
              onProcessed={loadImports}
            />
          ))}
        </div>
      )}
    </main>
  );
}
