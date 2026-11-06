
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";

export const dynamic = "force-dynamic";

export default async function MojKodicPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const participations = await prisma.giveawayParticipation.findMany({
    where: {
      userId: user.id,
    },
    include: {
      giveaway: {
        select: {
          id: true,
          title: true,
          organizer: true,
          prize: true,
          imageUrl: true,
          originalUrl: true,
          endsAt: true,
          active: true,
          winnerAnnouncementUrl: true,
          winnerAnnouncedAt: true,
        },
      },
    },
    orderBy: {
      participatedAt: "desc",
    },
  });

  const now = new Date();

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-purple-700">
            kodic.ba
          </Link>

          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link href="/dashboard" className="text-gray-600 hover:text-purple-700">
              Grebi i Osvoji
            </Link>
            <Link href="/giveaways" className="text-gray-600 hover:text-purple-700">
              Nagradne igre
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="font-semibold text-purple-700">MOJ KODIC</p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Moje nagradne igre
          </h1>

          <p className="mt-2 text-gray-500">
            Pregled svih nagradnih igara u kojima si evidentirao učešće.
          </p>
        </div>

        <div className="mb-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Ukupno evidentiranih učešća
            </p>
            <p className="mt-2 text-3xl font-bold text-purple-700">
              {participations.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Igre sa objavljenim pobjednicima
            </p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {participations.filter(
                (item) =>
                  item.giveaway.winnerAnnouncedAt ||
                  item.giveaway.winnerAnnouncementUrl
              ).length}
            </p>
          </div>
        </div>

        {participations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="text-5xl">🎁</div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              Još nema evidentiranih učešća
            </h2>

            <p className="mt-2 text-gray-500">
              Pronađi zanimljivu nagradnu igru i klikni na „Igrao sam“.
            </p>

            <Link
              href="/giveaways"
              className="mt-6 inline-block rounded-xl bg-purple-700 px-6 py-3 font-semibold text-white hover:bg-purple-800"
            >
              Pregledaj nagradne igre
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {participations.map((item) => {
              const giveaway = item.giveaway;

              const ended =
                !giveaway.active ||
                (giveaway.endsAt !== null && giveaway.endsAt < now);

              const winnersAnnounced =
                Boolean(giveaway.winnerAnnouncedAt) ||
                Boolean(giveaway.winnerAnnouncementUrl);

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                >
                  {giveaway.imageUrl ? (
                    <img
                      src={giveaway.imageUrl}
                      alt={giveaway.title}
                      className="h-48 w-full bg-gray-100 object-cover"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-gradient-to-br from-purple-100 to-fuchsia-100">
                      <span className="text-6xl">🎁</span>
                    </div>
                  )}

                  <div className="p-5">
                    <p className="text-sm font-semibold text-purple-700">
                      {giveaway.organizer}
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-gray-900">
                      {giveaway.title}
                    </h2>

                    {giveaway.prize && (
                      <div className="mt-3 rounded-xl bg-purple-50 p-3">
                        <p className="text-xs font-medium uppercase text-purple-600">
                          Nagrada
                        </p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {giveaway.prize}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {winnersAnnounced ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Pobjednici objavljeni
                        </span>
                      ) : ended ? (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                          Završena
                        </span>
                      ) : (
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                          Aktivna
                        </span>
                      )}

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        ✓ Učešće evidentirano
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-gray-500">
                      Učešće evidentirano:{" "}
                      {new Date(item.participatedAt).toLocaleDateString(
                        "bs-BA",
                        { timeZone: "UTC" }
                      )}
                    </p>

                    {giveaway.endsAt && (
                      <p className="mt-1 text-sm text-gray-500">
                        Završetak:{" "}
                        {new Date(giveaway.endsAt).toLocaleDateString(
                          "bs-BA",
                          { timeZone: "UTC" }
                        )}
                      </p>
                    )}

                    {giveaway.winnerAnnouncementUrl ? (
                      <a
                        href={giveaway.winnerAnnouncementUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 block rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-semibold text-green-700 hover:bg-green-100"
                      >
                        Pogledaj objavu pobjednika
                      </a>
                    ) : (
                      <a
                        href={giveaway.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 block rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-center text-sm font-medium text-purple-700 hover:bg-purple-100"
                      >
                        Pogledaj originalnu objavu
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
