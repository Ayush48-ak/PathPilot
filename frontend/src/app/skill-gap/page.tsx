
"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type UserSkill = {
  id: number;
  userId: number;
  name: string;
  proficiency: string;
};

type CareerSkill = {
  id: number;
  name: string;
  description: string | null;
  importance: string | null;
  level: string | null;
};

type SkillGap = {
  userId: number;
  careerId: number;
  careerName: string;
  totalRequiredSkills: number;
  matchedCount: number;
  missingCount: number;
  coveragePercentage: number;
  matchedSkills: CareerSkill[];
  missingSkills: CareerSkill[];
};

const API_URL = "http://localhost:3001";
const USER_ID = 2;
const CAREER_ID = 1;

export default function SkillGapPage() {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [analysis, setAnalysis] = useState<SkillGap | null>(null);
  const [name, setName] = useState("");
  const [proficiency, setProficiency] = useState("Beginner");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [skillsResponse, analysisResponse] = await Promise.all([
        fetch(`${API_URL}/users/${USER_ID}/skills`, {
          cache: "no-store",
        }),
        fetch(`${API_URL}/users/${USER_ID}/skill-gap/${CAREER_ID}`, {
          cache: "no-store",
        }),
      ]);

      if (!skillsResponse.ok || !analysisResponse.ok) {
        throw new Error("Could not load skills. Check that the backend is running.");
      }

      const skillsData: UserSkill[] = await skillsResponse.json();
      const analysisData: SkillGap = await analysisResponse.json();

      setSkills(skillsData);
      setAnalysis(analysisData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("Please enter a skill name.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/users/${USER_ID}/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          proficiency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save the skill.");
      }

      setName("");
      setMessage("Skill added successfully.");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save the skill.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-widest text-blue-400">
            PathPilot · Career Planning
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Skill Gap Analysis
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-400">
            Track your current skills, compare them with your target career,
            and identify what you need to learn next.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-emerald-900 bg-emerald-950/30 p-4 text-sm text-emerald-300"
          >
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-400">
            Loading your skill analysis...
          </div>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Target career</p>
                <h2 className="mt-2 font-semibold">
                  {analysis?.careerName ?? "Selected career"}
                </h2>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Skill coverage</p>
                <p className="mt-2 text-3xl font-bold text-blue-400">
                  {analysis?.coveragePercentage ?? 0}%
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Matched skills</p>
                <p className="mt-2 text-3xl font-bold text-emerald-400">
                  {analysis?.matchedCount ?? 0}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Missing skills</p>
                <p className="mt-2 text-3xl font-bold text-amber-400">
                  {analysis?.missingCount ?? 0}
                </p>
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
              <h2 className="text-xl font-semibold">
                Add a current skill
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Add skills you already know. Use a name that matches the
                career requirement to count as a match.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-[1fr_180px_auto]">
                <div>
                  <label
                    htmlFor="skill-name"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Skill name
                  </label>
                  <input
                    id="skill-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Python Fundamentals"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="proficiency"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Proficiency
                  </label>
                  <select
                    id="proficiency"
                    value={proficiency}
                    onChange={(event) => setProficiency(event.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Add Skill"}
                  </button>
                </div>
              </form>
            </section>

            <section className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold text-emerald-400">
                  Skills you have
                </h2>

                {skills.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-400">
                    No current skills added yet.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                      >
                        <p className="font-medium">{skill.name}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          Proficiency: {skill.proficiency}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold text-amber-400">
                  Skills to learn
                </h2>

                {!analysis || analysis.missingSkills.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-400">
                    No missing skill requirements found.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {analysis.missingSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                      >
                        <p className="font-medium">{skill.name}</p>
                        {skill.description && (
                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {skill.description}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {skill.level && (
                            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                              {skill.level}
                            </span>
                          )}
                          {skill.importance && (
                            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
                              {skill.importance}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">
                  Required skills matched
                </h2>
                <span className="text-sm text-slate-400">
                  {analysis?.matchedCount ?? 0} of{" "}
                  {analysis?.totalRequiredSkills ?? 0}
                </span>
              </div>

              {!analysis || analysis.matchedSkills.length === 0 ? (
                <p className="mt-3 text-sm text-slate-400">
                  Add a skill that matches one of your career requirements
                  to see it here.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {analysis.matchedSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-start gap-3 rounded-xl border border-emerald-900/70 bg-emerald-950/20 p-4"
                    >
                      <span className="text-emerald-400">✓</span>
                      <div>
                        <p className="font-medium">{skill.name}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {skill.description || "Required career skill"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
