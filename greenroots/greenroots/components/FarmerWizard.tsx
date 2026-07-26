"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveSubmission, makeId, FarmerResult } from "@/lib/storage";

const TOTAL_STEPS = 2;

export default function FarmerWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [region, setRegion] = useState("");
  const [crop, setCrop] = useState("");

  const canAdvance = () => {
    if (step === 1) return region.trim().length > 1;
    if (step === 2) return crop.trim().length > 1;
    return false;
  };

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "farmer", region, crop }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      const id = makeId();
      saveSubmission({
        id,
        mode: "farmer",
        createdAt: new Date().toISOString(),
        region,
        crop,
        result: data.result as FarmerResult,
      });
      router.push(`/results/${id}`);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="card p-8 sm:p-10 max-w-xl mx-auto">
      <div className="flex gap-1.5 mb-8">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-canopy-700" : "bg-sand-200"}`} />
        ))}
      </div>

      {step === 1 && (
        <div>
          <span className="eyebrow">Step 1 of 2</span>
          <h2 className="font-display text-2xl font-semibold mt-2 mb-4">
            What region is your farm in?
          </h2>
          <input
            autoFocus
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="e.g. Multan, Sindh, Peshawar valley"
            className="w-full border border-soil-300 rounded-xl px-4 py-3 bg-sand-50 focus:border-canopy-700 outline-none"
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <span className="eyebrow">Step 2 of 2</span>
          <h2 className="font-display text-2xl font-semibold mt-2 mb-4">
            What crop do you currently grow there?
          </h2>
          <input
            autoFocus
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            placeholder="e.g. wheat, sugarcane, cotton"
            className="w-full border border-soil-300 rounded-xl px-4 py-3 bg-sand-50 focus:border-canopy-700 outline-none"
          />
        </div>
      )}

      {error && <p className="mt-4 text-sm text-clay-500">{error}</p>}

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1 || loading}
          className="btn-secondary disabled:opacity-40"
        >
          Back
        </button>

        {step < TOTAL_STEPS ? (
          <button onClick={() => setStep((s) => s + 1)} disabled={!canAdvance()} className="btn-primary">
            Next
          </button>
        ) : (
          <button onClick={submit} disabled={!canAdvance() || loading} className="btn-primary">
            {loading ? "Finding compatible trees…" : "Get tree recommendations"}
          </button>
        )}
      </div>
    </div>
  );
}
