import Link from "next/link";
import Image from "next/image";

export default function HomePage() {

  return (

    <main className="min-h-screen bg-gray-100">


      {/* HERO */}

      <section className="
        min-h-screen
        bg-gradient-to-br
        from-purple-700
        via-violet-600
        to-fuchsia-600
        flex
        items-center
        justify-center
        px-6
      ">


        <div className="
          max-w-4xl
          text-center
          text-white
        ">


          <div className="text-7xl mb-6">
            🎁
          </div>


          <h1 className="
            text-6xl
            font-bold
          ">
            KodiĆ
          </h1>


          <h2 className="
            mt-6
            text-3xl
            font-semibold
          ">
            Grebi ~ Osvoji ~ Uštedi
          </h2>


          <p className="
            mt-6
            text-lg
            text-purple-100
            leading-8
          ">
            Digitalne nagradne igre koje povezuju
            kupce i brendove kroz popuste, kupone
            i vrijedne nagrade.
          </p>

          <div className="mb-6 flex justify-center">



          </div>


          <div className="
            mt-10
            flex
            justify-center
            gap-4
            flex-wrap
          ">


            <Link
              href="/login"
              className="
                bg-white
                text-purple-700
                px-8
                py-3
                rounded-xl
                font-semibold
              "
            >
              Prijava
            </Link>



            <Link
              href="/register"
              className="
                border
                border-white
                px-8
                py-3
                rounded-xl
                font-semibold
              "
            >
              Registracija
            </Link>


          </div>



          <Link
            href="/register/client"
            className="
              block
              mt-6
              text-purple-100
              hover:text-white
              underline
            "
          >
            Postani naš partner →
          </Link>

          <Image
            src="/logo.png"
            alt="Kodić"
            width={120}
            height={120}
            priority
          />


        </div>



      </section>



      {/* KAKO RADI */}

      <section className="
        py-20
        px-6
        max-w-5xl
        mx-auto
      ">


        <h2 className="
          text-4xl
          font-bold
          text-center
          text-gray-800
        ">
          Kako funkcioniše?
        </h2>



        <div className="
          grid
          md:grid-cols-3
          gap-6
          mt-12
        ">


          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold text-gray-900">
              1. Registruj se
            </h3>
            <p className="mt-3 text-gray-600">
              Kreiraj svoj nalog i učestvuj
              u osvajanju ušteda i popusta
            </p>
          </div>



          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold text-gray-900">
              2. Grebi karticu
            </h3>
            <p className="mt-3 text-gray-600">
              Svakog dana imaš jednu grebalicu, a pozivom prijatelja dobijaš po jednu gratis. Svaka je dobitna!
            </p>
          </div>



          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold text-gray-900">
              3. Iskoristi nagradu
            </h3>
            <p className="mt-3 text-gray-600">
              Dobijeni kupon iskoristi kod
              naših partnera.
            </p>
          </div>


        </div>


      </section>



      {/* PARTNERI */}

      <section className="
        bg-purple-50
        py-20
        px-6
        text-center
      ">


        <h2 className="
          text-4xl
          font-bold
          text-gray-800
        ">
          Postanite Kodić partner
        </h2>


        <p className="
          mt-5
          text-gray-600
          max-w-2xl
          mx-auto
        ">
          Kreirajte kampanje, privucite nove kupce
          i nagradite postojeće kroz moderne
          digitalne nagradne igre.
        </p>


        <Link
          href="/register/client"
          className="
            inline-block
            mt-8
            bg-purple-600
            text-white
            px-8
            py-3
            rounded-xl
            font-semibold
          "
        >
          Postani partner
        </Link>


      </section>

      <footer className="bg-gray-900 text-gray-300 py-10">

        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="text-center md:text-left">

            <h3 className="text-xl font-bold text-white">
              Kodić
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              © {new Date().getFullYear()} Kodić. Sva prava zadržana.
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
              </svg>
            </a>



            <a
              href="https://www.instagram.com/kod_icc/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5Zm0 2h8.5A3.75 3.75 0 0 1 20 7.75v8.5A3.75 3.75 0 0 1 16.25 20h-8.5A3.75 3.75 0 0 1 4 16.25v-8.5A3.75 3.75 0 0 1 7.75 4Zm8.75 1a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 16.5 5ZM12 7a5 5 0 1 0 0 10a5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6a3 3 0 0 1 0-6Z" />
              </svg>
            </a>



            <a
              href="https://www.tiktok.com/@kodicc"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
              aria-label="TikTok"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16.5 2c.3 2.2 1.6 3.8 3.8 4v2.5c-1.5 0-2.8-.5-3.8-1.3v7.1A5.3 5.3 0 1 1 11.2 9v2.7a2.7 2.7 0 1 0 2.7 2.7V2h2.6Z" />
              </svg>
            </a>

          </div>

        </div>

      </footer>


    </main>

  );
}