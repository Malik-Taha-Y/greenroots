import { Submission } from "@/lib/storage";

export default function ResultView({ submission }: { submission: Submission }) {
  const date = new Date(submission.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div id="screenshot-area" className="card p-8 sm:p-10">
      <div className="flex items-center gap-2 mb-1">
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
          <path
            d="M14 26V15M14 15C14 15 7 14 7 7C7 7 14 8 14 15ZM14 15C14 15 21 14 21 7C21 7 14 8 14 15Z"
            stroke="#1F4D33"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-display font-semibold text-canopy-900">GreenRoots</span>
      </div>
      <p className="eyebrow mb-6">{date}</p>

      {submission.mode === "plant" ? (
        <div>
          <h1 className="font-display text-2xl font-semibold text-canopy-900">
            Recommendations for {submission.region}
          </h1>
          <p className="mt-2 text-sm text-canopy-800/70">
            Soil: {describeHandful(submission.soilHandful)}, {describeDrainage(submission.soilDrainage)},{" "}
            {describeTexture(submission.soilTexture)}. Watering budget: {submission.wateringMinutes} min/day.
          </p>

          <div className="mt-8">
            <h2 className="eyebrow mb-3">Recommended species</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {submission.result.species.map((sp, i) => (
                <div key={i} className="rounded-xl border border-soil-300 bg-sand-50 p-5">
                  <p className="font-display font-semibold text-canopy-900">{sp.name}</p>
                  {sp.localName && (
                    <p className="text-xs text-soil-700 mb-2">{sp.localName}</p>
                  )}
                  <p className="text-sm text-canopy-800/80">{sp.why}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="eyebrow mb-3">Watering schedule — first two months</h2>
            <ol className="space-y-2">
              {submission.result.wateringSchedule.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-canopy-900">
                  <span className="font-semibold text-canopy-700">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8">
            <h2 className="eyebrow mb-3">Care warnings</h2>
            <ul className="space-y-2">
              {submission.result.warnings.map((w, i) => (
                <li key={i} className="flex gap-2 text-sm bg-[#FBF1E8] border border-soil-300 rounded-lg px-4 py-3 text-soil-800">
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="font-display text-2xl font-semibold text-canopy-900">
            Agroforestry matches for {submission.region}
          </h1>
          <p className="mt-2 text-sm text-canopy-800/70">Current crop: {submission.crop}</p>

          <div className="mt-8">
            <h2 className="eyebrow mb-3">Recommended tree species</h2>
            <div className="grid gap-4">
              {submission.result.species.map((sp, i) => (
                <div key={i} className="rounded-xl border border-soil-300 bg-sand-50 p-5">
                  <p className="font-display font-semibold text-canopy-900">{sp.name}</p>
                  {sp.localName && <p className="text-xs text-soil-700 mb-2">{sp.localName}</p>}
                  <p className="text-sm text-canopy-800/80">{sp.why}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-canopy-700">
                    <span><strong>Spacing:</strong> {sp.spacing}</span>
                    <span><strong>Placement:</strong> {sp.placement}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="eyebrow mb-3">General advice</h2>
            <ul className="space-y-2">
              {submission.result.generalAdvice.map((a, i) => (
                <li key={i} className="flex gap-2 text-sm bg-[#FBF1E8] border border-soil-300 rounded-lg px-4 py-3 text-soil-800">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function describeHandful(v: string) {
  return { holds: "clay-leaning soil", crumbles: "sandy soil", "in-between": "loamy soil" }[v] || v;
}
function describeDrainage(v: string) {
  return { fast: "fast-draining", pools: "poor drainage", moderate: "moderate drainage" }[v] || v;
}
function describeTexture(v: string) {
  return { gritty: "gritty texture", smooth: "smooth texture", sticky: "sticky texture" }[v] || v;
}
