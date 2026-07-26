export type PlantSubmission = {
  id: string;
  mode: "plant";
  createdAt: string;
  region: string;
  soilHandful: string;
  soilDrainage: string;
  soilTexture: string;
  wateringMinutes: string;
  result: PlantResult;
};

export type FarmerSubmission = {
  id: string;
  mode: "farmer";
  createdAt: string;
  region: string;
  crop: string;
  result: FarmerResult;
};

export type Submission = PlantSubmission | FarmerSubmission;

export type PlantResult = {
  species: Array<{
    name: string;
    localName?: string;
    why: string;
  }>;
  wateringSchedule: string[];
  warnings: string[];
};

export type FarmerResult = {
  species: Array<{
    name: string;
    localName?: string;
    why: string;
    spacing: string;
    placement: string;
  }>;
  generalAdvice: string[];
};

const KEY = "greenroots_submissions";

export function getSubmissions(): Submission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Submission[];
    return parsed.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  } catch {
    return [];
  }
}

export function getSubmission(id: string): Submission | undefined {
  return getSubmissions().find((s) => s.id === id);
}

export function saveSubmission(sub: Submission) {
  if (typeof window === "undefined") return;
  const existing = getSubmissions();
  const next = [sub, ...existing];
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function deleteSubmission(id: string) {
  if (typeof window === "undefined") return;
  const next = getSubmissions().filter((s) => s.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
