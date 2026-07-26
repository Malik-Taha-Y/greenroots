"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import ResultView from "@/components/ResultView";
import { getSubmission, Submission } from "@/lib/storage";

export default function ResultsPage() {
  const params = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<Submission | null | undefined>(undefined);

  useEffect(() => {
    setSubmission(getSubmission(params.id) ?? null);
  }, [params.id]);

  return (
    <main className="min-h-screen">
      <Header />
      <section className="mx-auto max-w-3xl px-6 pt-6 pb-24">
        {submission === undefined && (
          <p className="text-canopy-800/70 text-sm">Loading…</p>
        )}
        {submission === null && (
          <div className="card p-8 text-center">
            <p className="font-display text-xl font-semibold mb-2">We couldn&apos;t find that result</p>
            <p className="text-sm text-canopy-800/70 mb-6">
              It may have been saved on a different device or browser — recommendations are
              stored locally on the device that created them.
            </p>
            <Link href="/" className="btn-primary">Start a new recommendation</Link>
          </div>
        )}
        {submission && (
          <>
            <ResultView submission={submission} />
            <div className="mt-6 flex flex-wrap gap-3 justify-between">
              <Link href="/history" className="btn-secondary">See all past recommendations</Link>
              <Link href="/" className="btn-primary">Get another recommendation</Link>
            </div>
            <p className="mt-4 text-xs text-canopy-800/50 text-center">
              Tip: screenshot this card to save or share it.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
