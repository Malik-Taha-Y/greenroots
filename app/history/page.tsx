"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { getSubmissions, deleteSubmission, Submission } from "@/lib/storage";

export default function HistoryPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSubmissions(getSubmissions());
    setLoaded(true);
  }, []);

  function remove(id: string) {
    deleteSubmission(id);
    setSubmissions(getSubmissions());
  }

  return (
    <main className="min-h-screen">
      <Header />
      <section className="mx-auto max-w-3xl px-6 pt-6 pb-24">
        <h1 className="font-display text-3xl font-semibold text-canopy-900 mb-2">
          Past recommendations
        </h1>
        <p className="text-sm text-canopy-800/70 mb-8">
          Saved on this device only — clearing your browser data will remove this history.
        </p>

        {loaded && submissions.length === 0 && (
          <div className="card p-8 text-center">
            <p className="font-display text-lg font-semibold mb-2">Nothing here yet</p>
            <p className="text-sm text-canopy-800/70 mb-6">
              Get a recommendation and it will show up here so you can revisit it later.
            </p>
            <Link href="/" className="btn-primary">Get a recommendation</Link>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {submissions.map((s) => (
            <div key={s.id} className="card p-5 flex items-center justify-between gap-4">
              <Link href={`/results/${s.id}`} className="flex-1">
                <p className="font-semibold text-canopy-900">
                  {s.mode === "plant" ? `Sapling plan — ${s.region}` : `Farm plan — ${s.region} (${s.crop})`}
                </p>
                <p className="text-xs text-canopy-800/60 mt-1">
                  {new Date(s.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </Link>
              <button
                onClick={() => remove(s.id)}
                className="text-xs text-clay-500 hover:underline shrink-0"
                aria-label="Delete this recommendation"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
