"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveSubmission, makeId, PlantResult } from "@/lib/storage";

const HANDFUL_OPTIONS = [
  { value: "holds", label: "Holds its shape like dough" },
  { value: "crumbles", label: "Crumbles apart right away" },
  { value: "in-between", label: "Holds briefly, then breaks apart" },
];

const DRAINAGE_OPTIONS = [
  { value: "fast", label: "Drains away quickly, ground looks dry soon after" },
  { value: "pools", label: "Water pools or sits on top for a while" },
  { value: "moderate", label: "Soaks in steadily, no pooling" },
];

const TEXTURE_OPTIONS = [
  { value: "gritty", label: "Gritty, like sand" },
  { value: "smooth", label: "Smooth and powdery" },
  { value: "sticky", label: "Sticky when wet" },
];

const TOTAL_STEPS = 5;

export default function PlantWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [region, setRegion] = useState("");
  const [soilHandful, setSoilHandful] = useState("");
  const [soilDrainage, setSoilDrainage] = useState("");
  const [soilTexture, setSoilTexture] = useState("");
  const [wateringMinutes, setWateringMinutes] = useState("");

  const canAdvance = () => {
    if (step === 1) return region.trim().length > 1;
    if (step === 2) return !!soilHandful;
    if (step === 3) return !!soilDrainage;
    if (step === 4) return !!soilTexture;
    if (step === 5) return wateringMinutes.trim().length > 0;
    return false;
  };

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "plant",
          region,
          soilHandful,
          soilDrainage,
          soilTexture,
          wateringMinutes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      const id = makeId();
      saveSubmission({
        id,
        mode: "plant",
        createdAt: new Date().toISOString(),
        region,
        soilHandful,
        soilDrainage,
        soilTexture,
        wateringMinutes,
        result: data.result as PlantResult,
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
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < step ? "bg-canopy-700" : "bg-sand-200"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div>
          <span className="eyebrow">Step 1 of 5</span>
          <h2 className="font-display text-2xl font-semibold mt-2 mb-4">
            What city or region are you in?
          </h2>
          <input
            autoFocus
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="e.g. Karachi, Lahore, Abbottabad"
            className="w-full border border-soil-300 rounded-xl px-4 py-3 bg-sand-50 focus:border-canopy-700 outline-none"
          />
        </div>
      )}

      {step === 2 && (
        <QuestionStep
          stepLabel="Step 2 of 5"
          question="Grab a handful of moist soil and squeeze it. What happens?"
          options={HANDFUL_OPTIONS}
          value={soilHandful}
          onChange={setSoilHandful}
        />
      )}

      {step === 3 && (
        <QuestionStep
          stepLabel="Step 3 of 5"
          question="After rain, what does the ground do?"
          options={DRAINAGE_OPTIONS}
          value={soilDrainage}
          onChange={setSoilDrainage}
        />
      )}

      {step === 4 && (
        <QuestionStep
          stepLabel="Step 4 of 5"
          question="Rub some dry soil between your fingers. How does it feel?"
          options={TEXTURE_OPTIONS}
          value={soilTexture}
          onChange={setSoilTexture}
        />
      )}

      {step === 5 && (
        <div>
          <span className="eyebrow">Step 5 of 5</span>
          <h2 className="font-display text-2xl font-semibold mt-2 mb-4">
            How many minutes a day can you spend watering?
          </h2>
          <input
            autoFocus
            type="number"
            min={0}
            value={wateringMinutes}
            onChange={(e) => setWateringMinutes(e.target.value)}
            placeholder="e.g. 5"
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
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance()}
            className="btn-primary"
          >
            Next
          </button>
        ) : (
          <button onClick={submit} disabled={!canAdvance() || loading} className="btn-primary">
            {loading ? "Growing your recommendation…" : "Get my tree recommendation"}
          </button>
        )}
      </div>
    </div>
  );
}

function QuestionStep({
  stepLabel,
  question,
  options,
  value,
  onChange,
}: {
  stepLabel: string;
  question: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="eyebrow">{stepLabel}</span>
      <h2 className="font-display text-2xl font-semibold mt-2 mb-4">{question}</h2>
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            data-selected={value === opt.value}
            onClick={() => onChange(opt.value)}
            className="choice-btn"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
