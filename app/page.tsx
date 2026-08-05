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
            <h3 className="text-xl font-bold">
              1. Registruj se
            </h3>
            <p className="mt-3 text-gray-600">
              Kreiraj svoj nalog i učestvuj
              u nagradnim igrama.
            </p>
          </div>



          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold">
              2. Grebi karticu
            </h3>
            <p className="mt-3 text-gray-600">
              Svakog dana pokušaj osvojiti
              posebne popuste.
            </p>
          </div>



          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold">
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


    </main>

  );
}