
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";
import ParticipationButton from "./ParticipationButton";
import LogoutButton from "../components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function GiveawaysPage() {
  const user = await getCurrentUser();
  const now = new Date();

  const giveaways = await prisma.giveaway.findMany({
    where: {
      active: true,
      AND: [
        {
          OR: [
            { startsAt: null },
            { startsAt: { lte: now } },
          ],
        },
        {
          OR: [
            { endsAt: null },
            { endsAt: { gte: now } },
          ],
        },
      ],
    },
    include: {
      _count: {
        select: {
          participations: true,
          followers: true,
        },
      },
      participations: {
        where: {
          userId: user?.id ?? "",
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: [
      { endsAt: "asc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-purple-700">
            kodic.ba
          </Link>

          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link href="/" className="text-gray-600 hover:text-purple-700">
              Početna
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/moj-kodic"
                  className="text-purple-700 font-semibold hover:text-purple-900"
                >
                  Moj Kodić
                </Link>

                <LogoutButton />
              </div>
            ) : (
              <Link
                href="/login"
                className="text-purple-700 font-semibold hover:text-purple-900"
              >
                Prijava
              </Link>
            )}
          </nav>
        </div>
      </header>

      <section className="bg-gradient-to-br from-purple-700 via-violet-600 to-fuchsia-600 px-6 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 text-5xl">🏆</div>

          <h1 className="text-3xl font-bold md:text-5xl">
            Nagradne igre
          </h1>

          <p className="mt-5 text-lg leading-8 text-purple-100">
            Otkrij nagradne igre širom Bosne i Hercegovine.
            Pronađi zanimljive nagrade, učestvuj i prati proglašenje pobjednika.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Aktuelne nagradne igre
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Pronađeno: {giveaways.length} nagradnih igara
            </p>
          </div>
        </div>

        {giveaways.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="text-5xl">🎁</div>
            <h3 className="mt-5 text-xl font-bold text-gray-900">
              Trenutno nema aktivnih nagradnih igara
            </h3>
            <p className="mt-2 text-gray-500">
              Uskoro očekuj nove prilike za osvajanje nagrada.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-purple-700 px-6 py-3 font-semibold text-white hover:bg-purple-800"
            >
              Nazad na početnu
            </Link>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {giveaways.map((giveaway) => (
              <article
                key={giveaway.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {giveaway.imageUrl ? (
                  <img
                    src={giveaway.imageUrl}
                    alt={giveaway.title}
                    className="h-56 w-full bg-gray-100 object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-gradient-to-br from-purple-100 to-fuchsia-100">
                    <span className="text-7xl">🎁</span>
                  </div>
                )}

                <div className="p-5">
                  <p className="text-sm font-semibold text-purple-700">
                    {giveaway.organizer}
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-gray-900">
                    {giveaway.title}
                  </h3>

                  {giveaway.prize && (
                    <div className="mt-4 rounded-xl bg-purple-50 p-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-purple-600">
                        Nagrada
                      </p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {giveaway.prize}
                      </p>
                    </div>
                  )}

                  {giveaway.description && (
                    <p className="mt-4 line-clamp-3 whitespace-pre-line text-sm leading-6 text-gray-600">
                      {giveaway.description}
                    </p>
                  )}

                  <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-500">
                    <p>
                      Početak:{" "}
                      {giveaway.startsAt
                        ? new Date(giveaway.startsAt).toLocaleDateString("bs-BA", {
                          timeZone: "UTC",
                        })
                        : "Nije naveden"}
                    </p>

                    <p>
                      Završetak:{" "}
                      {giveaway.endsAt
                        ? new Date(giveaway.endsAt).toLocaleDateString("bs-BA", {
                          timeZone: "UTC",
                        })
                        : "Do isteka zaliha"}
                    </p>

                    <p>
                      👥 {giveaway._count.participations} evidentiranih učesnika
                    </p>
                  </div>

                  <a
                    href={giveaway.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 block rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-center text-sm font-medium text-purple-700 transition hover:bg-purple-100"
                  >
                    Pogledaj originalnu objavu →
                  </a>

                  {user && (
                    <ParticipationButton
                      giveawayId={giveaway.id}
                      initialParticipated={giveaway.participations.length > 0}
                      isLoggedIn={true}
                    />
                  )}

                  <p className="mt-3 text-center text-xs text-gray-400">
                    Nagradnu igru organizuje {giveaway.organizer}.
                    Kodic nije organizator.
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-gray-900 px-6 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Kodic.ba
        <p className="mt-2">
          Kodic informiše o nagradnim igrama trećih organizatora.
        </p>
      </footer>
    </main>
  );
}
