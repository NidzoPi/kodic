
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManualImportPage() {
  const router = useRouter();

  const [sourcePageName, setSourcePageName] = useState("Kodic - nagradne igre BiH");
  const [description, setDescription] = useState(
    "🎁 VELIKA NAGRADNA IGRA!\n\nOsvoji fantastičan poklon paket!\n\nZa učešće zapratite stranicu i ostavite komentar."
  );
  const [originalUrl, setOriginalUrl] = useState(
    "https://www.facebook.com/"
  );
  const [imageUrl, setImageUrl] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const labelClass = "mb-1 block text-sm font-semibold text-gray-900";

  const inputClass =
    "w-full rounded-lg border border-gray-400 bg-white px-3 py-2.5 text-gray-950 placeholder:text-gray-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-200";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/giveaway-imports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourcePageName,
          description,
          originalUrl,
          imageUrl,
          publishedAt: publishedAt || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Greška pri unosu.");
      }

      setMessage("Objava je uspješno dodana!");
      router.push("/admin/giveaways/imports");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Došlo je do greške."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-950">
          Ručni unos Facebook objave
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Ručno dodaj Facebook objavu koja će se pojaviti na listi za pregled
          i odobravanje.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className={labelClass}>
            Naziv Facebook stranice *
          </label>
          <input
            required
            value={sourcePageName}
            onChange={(e) => setSourcePageName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Opis Facebook objave *
          </label>
          <textarea
            required
            rows={7}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Link originalne objave *
          </label>
          <input
            required
            type="url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Link slike (opcionalno)
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Datum Facebook objave
          </label>
          <input
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className={inputClass}
          />
        </div>

        {message && (
          <p className="rounded-lg border border-purple-200 bg-purple-50 p-3 text-sm font-medium text-purple-900">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-purple-700 px-5 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Dodavanje..." : "Dodaj objavu"}
        </button>
      </form>
    </div>
  );
}
