
import Link from "next/link";
import Image from "next/image";
import InstallAppButton from "./components/InstallAppButton";

import { getCurrentUser } from "@/lib/auth/currentUser";
import LogoutButton from "./components/LogoutButton";



export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-white">

      {/* NAVIGATION */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/paket.png"
              alt="Kodic"
              width={48}
              height={48}
              priority
            />
            <span className="text-2xl font-bold text-purple-700">
              kodic.ba
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-gray-700 font-medium">
            <a href="#ponuda" className="hover:text-purple-700">
              Šta je Kodic?
            </a>
            <a href="#partneri" className="hover:text-purple-700">
              Za partnere
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/moj-kodic"
                  className="text-purple-700 font-semibold hover:text-purple-900"
                >
                  Moj Kodić
                </Link>

                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-purple-700 font-semibold hover:text-purple-900"
                >
                  Prijava
                </Link>

                <Link
                  href="/register"
                  className="bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-purple-800 transition"
                >
                  Registracija
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-br from-purple-700 via-violet-600 to-fuchsia-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">

          <div className="flex justify-center mb-6">
            <Image
              src="/paket-rb.png"
              alt="Kodic"
              width={110}
              height={110}
              priority
            />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold">
            Dobro došli na Kodic!
          </h1>

          <h2 className="mt-6 text-2xl md:text-4xl font-semibold">
            Otkrij. Učestvuj. Osvoji.
          </h2>

          <p className="mt-6 text-lg md:text-xl text-purple-100 max-w-2xl mx-auto leading-8">
            Jedno mjesto za otkrivanje pogodnosti,
            popusta i nagradnih igara širom Bosne i Hercegovine.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href={user ? "/dashboard" : "/register"}
              className="bg-white text-purple-700 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition"
            >
              Pridruži se Kodicu
            </Link>

            <Link
              href="#ponuda"
              className="border border-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              Istraži Kodic
            </Link>
          </div>

          <div className="mt-6 flex justify-center">
            <InstallAppButton />
          </div>
        </div>
      </section>

      {/* TWO MAIN MODULES */}
      <section id="ponuda" className="py-20 px-6 bg-gray-50 scroll-mt-0">
        <div className="max-w-6xl mx-auto">

          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Šta možeš raditi na Kodicu?
            </h2>

            <p className="mt-4 text-gray-600">
              Izaberi ono što te zanima. Dvije različite mogućnosti,
              jedna platforma.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">

            {/* SCRATCHWIN */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-purple-100">
              <div className="bg-gradient-to-br from-purple-600 to-violet-800 p-10 text-center text-white">
                <div className="text-7xl">🎁</div>
                <h3 className="text-3xl font-bold mt-5">
                  Grebi i osvoji
                </h3>
                <p className="mt-3 text-purple-100">
                  Otkrij popuste i pogodnosti naših partnera.
                </p>
              </div>

              <div className="p-8">
                <ul className="space-y-3 text-gray-700">
                  <li>✓ Svakodnevne ScratchWin kartice</li>
                  <li>✓ Posebne ponude i popusti</li>
                  <li>✓ Dodatna grebanja pozivanjem prijatelja</li>
                  <li>✓ Digitalni kuponi kod partnera</li>
                </ul>

                <Link
                  href={user ? "/dashboard" : "/register"}
                  className="block mt-8 text-center bg-purple-700 text-white py-3 rounded-xl font-semibold hover:bg-purple-800 transition"
                >
                  Istraži Grebi i osvoji →
                </Link>
              </div>
            </div>

            {/* GIVEAWAYS */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-fuchsia-100">
              <div className="bg-gradient-to-br from-fuchsia-600 to-purple-800 p-10 text-center text-white">
                <div className="text-7xl">🏆</div>
                <h3 className="text-3xl font-bold mt-5">
                  Nagradne igre
                </h3>
                <p className="mt-3 text-fuchsia-100">
                  Pronađi nagradne igre i prati proglašenje pobjednika.
                </p>
              </div>

              <div className="p-8">
                <ul className="space-y-3 text-gray-700">
                  <li>✓ Nagradne igre iz cijele BiH</li>
                  <li>✓ Pregled nagrada i pravila</li>
                  <li>✓ Praćenje igara u kojima učestvuješ</li>
                  <li>✓ Obavještenja kada bude objavljen pobjednik</li>
                </ul>

                <Link
                  href="/giveaways"
                  className="block mt-8 text-center border-2 border-purple-700 text-purple-700 py-3 rounded-xl font-semibold hover:bg-purple-50 transition"
                >
                  Pogledaj nagradne igre →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
            Dva načina da koristiš Kodic
          </h2>

          <div className="grid md:grid-cols-2 gap-12 mt-14">

            <div>
              <h3 className="text-2xl font-bold text-purple-700">
                🎁 Grebi i osvoji
              </h3>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900">
                    1. Registruj se
                  </h4>
                  <p className="text-gray-600 mt-2">
                    Kreiraj besplatan Kodic nalog.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900">
                    2. Grebi karticu
                  </h4>
                  <p className="text-gray-600 mt-2">
                    Otkrij popuste i pogodnosti.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900">
                    3. Iskoristi kupon
                  </h4>
                  <p className="text-gray-600 mt-2">
                    Ostvari pogodnost kod našeg partnera.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-fuchsia-700">
                🏆 Nagradne igre
              </h3>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900">
                    1. Pronađi nagradnu igru
                  </h4>
                  <p className="text-gray-600 mt-2">
                    Pregledaj aktuelne nagradne igre u BiH.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900">
                    2. Učestvuj
                  </h4>
                  <p className="text-gray-600 mt-2">
                    Otvori originalnu objavu organizatora
                    i prati njena pravila.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900">
                    3. Prati pobjednika
                  </h4>
                  <p className="text-gray-600 mt-2">
                    Aktiviraj obavještenje i saznaj kada
                    organizator objavi dobitnika.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section id="partneri" className="bg-purple-50 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Postanite Kodic partner
          </h2>

          <p className="mt-5 text-gray-600 leading-7">
            Promovišite svoje poslovanje, privucite nove kupce
            i nagradite postojeće kroz digitalne kampanje,
            popuste i posebne pogodnosti.
          </p>

          <Link
            href="/register/client"
            className="inline-block mt-8 bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-800 transition"
          >
            Postani partner →
          </Link>

        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="py-10 px-6 text-center">
        <p className="max-w-3xl mx-auto text-sm text-gray-500">
          Kodic je platforma za promociju pogodnosti i informisanje
          o nagradnim igrama. Nagradne igre koje organizuju treće
          strane nisu organizovane niti vođene od strane Kodica.
          Za uslove, izbor pobjednika i dodjelu nagrada odgovorni
          su njihovi organizatori.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white">
              Kodic.ba
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              © {new Date().getFullYear()} Kodic. Sva prava zadržana.
            </p>
          </div>

          <div className="flex items-center gap-6">

            <a
              href="https://www.facebook.com/groups/9628165363892153"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
              aria-label="Facebook"
            >
              Facebook
            </a>

            <a
              href="https://www.instagram.com/kod_icc/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
              aria-label="Instagram"
            >
              Instagram
            </a>

            <a
              href="https://www.tiktok.com/@kodicc"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
              aria-label="TikTok"
            >
              TikTok
            </a>

          </div>

        </div>
      </footer>

    </main>
  );
}
