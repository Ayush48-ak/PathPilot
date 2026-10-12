
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = "http://localhost:3001";
const USER_ID = 2;

type Career = {
  id: number;
  name: string;
  description?: string;
  category?: string;
};

type UserProfile = {
  userId: number;
  careerGoal: string | null;
};

type Progress = {
  userId: number;
  topicId: number;
  completed: boolean;
};

type SkillGap = {
  careerName?: string;
  totalRequiredSkills: number;
  matchedCount: number;
  missingCount: number;
  coveragePercentage: number;
};

type RoadmapTopic = {
  id: number;
  title: string;
};

type RoadmapPhase = {
  id: number;
  title: string;
  topics?: RoadmapTopic[];
};

type RoadmapResponse = {
  career?: Career;
  phases?: RoadmapPhase[];
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export default function DashboardPage() {
  const [career, setCareer] = useState<Career | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [skillGap, setSkillGap] = useState<SkillGap | null>(null);
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        // Load the saved profile and available careers first.
        const [profiles, careers, savedProgress] = await Promise.all([
          fetchJson<UserProfile[]>(`${API}/profiles`),
          fetchJson<Career[]>(`${API}/career-paths`),
          fetchJson<Progress[]>(`${API}/users/${USER_ID}/progress`),
        ]);

        if (!active) return;

        const profile = profiles.find((item) => item.userId === USER_ID);

        if (!profile?.careerGoal) {
          setCareer(null);
          setProgress(savedProgress);
          setSkillGap(null);
          setPhases([]);
          setError(
            "Choose a target career in your profile to personalize your dashboard."
          );
          return;
        }

        // Match the saved career goal to the actual career record.
        const selectedCareer = careers.find(
          (item) =>
            item.name.trim().toLowerCase() ===
            profile.careerGoal!.trim().toLowerCase()
        );

        if (!selectedCareer) {
          setCareer(null);
          setProgress(savedProgress);
          setSkillGap(null);
          setPhases([]);
          setError(
            `The selected career "${profile.careerGoal}" was not found in the career list. Please select an available career in your profile.`
          );
          return;
        }

        setCareer(selectedCareer);
        setProgress(savedProgress);

        // Fetch data for the selected career ID, not a fixed career ID.
        const [gapResult, roadmapResult] = await Promise.allSettled([
          fetchJson<SkillGap>(
            `${API}/users/${USER_ID}/skill-gap/${selectedCareer.id}`
          ),
          fetchJson<RoadmapResponse>(
            `${API}/career-paths/${selectedCareer.id}/roadmap`
          ),
        ]);

        if (!active) return;

        if (gapResult.status === "fulfilled") {
          setSkillGap(gapResult.value);
        } else {
          setSkillGap(null);
        }

        if (roadmapResult.status === "fulfilled") {
          setPhases(roadmapResult.value.phases ?? []);
        } else {
          setPhases([]);
        }

        const failedSections: string[] = [];

        if (gapResult.status === "rejected") {
          failedSections.push("skill-gap analysis");
        }

        if (roadmapResult.status === "rejected") {
          failedSections.push("learning roadmap");
        }

        if (failedSections.length > 0) {
          setError(
            `Could not load ${failedSections.join(" and ")} for ${selectedCareer.name}.`
          );
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load dashboard information."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const completedTopicIds = new Set(
    progress.filter((item) => item.completed).map((item) => item.topicId)
  );

  const allTopics = phases.flatMap((phase) => phase.topics ?? []);
  const completedTopics = allTopics.filter((topic) =>
    completedTopicIds.has(topic.id)
  ).length;

  const totalTopics = allTopics.length;
  const progressPercentage =
    totalTopics > 0
      ? Math.round((completedTopics / totalTopics) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <Link href="/" className="text-2xl font-bold tracking-tight">
              PathPilot<span className="text-blue-400">.</span>
            </Link>
            <p className="mt-1 text-sm text-slate-400">
              Your career journey, all in one place
            </p>
          </div>

          <Link
            href="/profile"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium transition hover:bg-slate-900"
          >
            My Profile
          </Link>
        </header>

        <section className="py-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Student workspace
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Your career dashboard
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-400">
            Track your learning, understand your skill gaps, and keep moving
            toward your target career.
          </p>
        </section>

        {loading && (
          <p className="mb-6 text-sm text-slate-400">
            Loading your personalized dashboard...
          </p>
        )}

        {error && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-amber-800 bg-amber-950/30 p-4 text-sm text-amber-200"
          >
            {error}
          </div>
        )}

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Target career</p>
            <h2 className="mt-3 text-xl font-semibold">
              {career?.name ?? (loading ? "Loading..." : "Not selected")}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {career?.category ?? "Choose your career in your profile"}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Roadmap completion</p>
            <p className="mt-3 text-3xl font-bold">
              {totalTopics > 0 ? `${progressPercentage}%` : "—"}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {completedTopics} of {totalTopics} topics completed
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Skills matched</p>
            <p className="mt-3 text-3xl font-bold">
              {skillGap ? skillGap.matchedCount : "—"}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {skillGap
                ? `${skillGap.missingCount} skills remaining`
                : "Skill analysis"}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Skill coverage</p>
            <p className="mt-3 text-3xl font-bold">
              {skillGap ? `${skillGap.coveragePercentage}%` : "—"}
            </p>
            <div
              className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800"
              role="progressbar"
              aria-label="Required skill coverage"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={skillGap?.coveragePercentage ?? 0}
            >
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(100, skillGap?.coveragePercentage ?? 0)
                  )}%`,
                }}
              />
            </div>
          </article>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Learning roadmap</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Progress for your selected career.
                </p>
              </div>

              {career && (
                <Link
                  href={`/careers/${career.id}`}
                  className="text-sm font-semibold text-blue-400 hover:text-blue-300"
                >
                  Open roadmap →
                </Link>
              )}
            </div>

            {phases.length > 0 ? (
              <div className="mt-6 space-y-5">
                {phases.map((phase) => {
                  const topics = phase.topics ?? [];
                  const completed = topics.filter((topic) =>
                    completedTopicIds.has(topic.id)
                  ).length;
                  const percentage =
                    topics.length > 0
                      ? Math.round((completed / topics.length) * 100)
                      : 0;

                  return (
                    <div
                      key={phase.id}
                      className="rounded-xl border border-slate-800 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-medium">{phase.title}</h3>
                        <span className="text-sm text-slate-400">
                          {completed}/{topics.length}
                        </span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-6 text-sm text-slate-500">
                {loading
                  ? "Loading roadmap phases..."
                  : "No roadmap topics are available for this career yet."}
              </p>
            )}
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Quick actions</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Continue exploring and improving your career readiness.
            </p>

            <div className="mt-6 space-y-3">
              <Link
                href="/careers"
                className="block rounded-lg bg-blue-500 px-4 py-3 text-center font-semibold transition hover:bg-blue-600"
              >
                Explore careers
              </Link>
              <Link
                href="/skill-gap"
                className="block rounded-lg border border-slate-700 px-4 py-3 text-center font-semibold transition hover:bg-slate-800"
              >
                Analyze skill gaps
              </Link>
              <Link
                href="/profile"
                className="block rounded-lg border border-slate-700 px-4 py-3 text-center font-semibold transition hover:bg-slate-800"
              >
                Update my profile
              </Link>
            </div>
          </article>
        </section>

        <footer className="mt-10 border-t border-slate-800 py-6 text-sm text-slate-500">
          PathPilot · Build skills. Track progress. Reach your goals.
        </footer>
      </div>
    </main>
  );
}
