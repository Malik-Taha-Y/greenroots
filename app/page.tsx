import Link from "next/link";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-root-lines bg-repeat">
      <Header />
      <section className="mx-auto max-w-5xl px-6 pt-10 pb-20">
        <p className="eyebrow mb-4">For gardens, streets, and farms across Pakistan</p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-[1.1] text-canopy-900 max-w-2xl">
          Plant the right tree, in the right soil, the right way.
        </h1>
        <p className="mt-5 text-lg text-canopy-800/80 max-w-xl">
          Most saplings don&apos;t die from neglect — they die from the wrong species meeting the
          wrong soil. Tell GreenRoots about your ground, and get a plan built for it.
        </p>

        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          <Link
            href="/plant"
            className="card p-8 flex flex-col justify-between hover:border-canopy-600 transition-colors min-h-[220px]"
          >
            <div>
              <span className="eyebrow">Individuals</span>
              <h2 className="font-display text-2xl font-semibold mt-2 text-canopy-900">
                I want to plant a tree
              </h2>
              <p className="mt-3 text-canopy-800/80 text-sm leading-relaxed">
                Answer three quick soil questions and tell us how much time you have to water —
                we&apos;ll match you to species that will actually survive where you live.
              </p>
            </div>
            <span className="mt-6 text-canopy-700 font-semibold text-sm">Start →</span>
          </Link>

          <Link
            href="/farmer"
            className="card p-8 flex flex-col justify-between hover:border-canopy-600 transition-colors min-h-[220px]"
          >
            <div>
              <span className="eyebrow">Farmers</span>
              <h2 className="font-display text-2xl font-semibold mt-2 text-canopy-900">
                I&apos;m a farmer
              </h2>
              <p className="mt-3 text-canopy-800/80 text-sm leading-relaxed">
                Tell us your region and current crop — we&apos;ll suggest trees that add income and
                shelter without competing with what you already grow.
              </p>
            </div>
            <span className="mt-6 text-canopy-700 font-semibold text-sm">Start →</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
