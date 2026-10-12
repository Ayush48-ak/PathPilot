
import TopicProgressTracker from "./topic-progress-tracker";

type Career = {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
};

type CareerSkill = {
  id: number;
  name: string;
  description: string | null;
  importance: string | null;
  level: string | null;
};

type RoadmapTopic = {
  id: number;
  title: string;
  description: string | null;
  order: number;
  estimatedHours: number | null;
  resourceUrl: string | null;
};

type RoadmapPhase = {
  id: number;
  title: string;
  description: string | null;
  order: number;
  duration: string | null;
  topics: RoadmapTopic[];
};

type CareerRoadmap = {
  career: Career;
  phases: RoadmapPhase[];
};

type CareerDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const API_URL = "http://localhost:3001";
const USER_ID = 2;

async function fetchJson(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export default async function CareerDetailsPage({
  params,
}: CareerDetailsPageProps) {
  const { id } = await params;

  let career: Career;

  let skills: CareerSkill[] = [];
  let roadmap: CareerRoadmap | null = null;

  let skillsError = false;
  let roadmapError = false;

  try {
    const data = await fetchJson(
      `${API_URL}/career-paths/${id}`,
    );

    career = Array.isArray(data) ? data[0] : data;

    if (!career) {
      throw new Error("Career not found");
    }
  } catch {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-4xl rounded-xl border border-red-900 bg-red-950/30 p-6">
          <h1 className="text-xl font-semibold text-red-400">
            Career not found
          </h1>

          <p className="mt-2 text-sm text-red-300">
            Check that the career exists and the backend is running.
          </p>
        </div>
      </main>
    );
  }

  try {
    skills = await fetchJson(
      `${API_URL}/career-paths/${id}/skills`,
    );
  } catch {
    skillsError = true;
  }

  try {
    roadmap = await fetchJson(
      `${API_URL}/career-paths/${id}/roadmap`,
    );
  } catch {
    roadmapError = true;
  }

  const phases = roadmap?.phases ?? [];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-400">
            Career Details
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {career.name}
          </h1>

          <div className="mt-4">
            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400">
              {career.category || "Technology"}
            </span>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-2xl font-semibold">
            About this career
          </h2>

          <p className="mt-4 leading-7 text-slate-400">
            {career.description || "No description available."}
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Required Skills
          </h2>

          {skillsError ? (
            <p className="mt-3 text-sm text-amber-300">
              Skills could not be loaded.
            </p>
          ) : skills.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">
              No required skills have been added yet.
            </p>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {skills.map((skill) => (
                <article
                  key={skill.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                >
                  <h3 className="font-semibold">
                    {skill.name}
                  </h3>

                  {skill.description && (
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {skill.description}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {skill.level && (
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                        {skill.level}
                      </span>
                    )}

                    {skill.importance && (
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                        {skill.importance}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">
            Learning Roadmap
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Mark topics as completed to track your learning progress.
          </p>

          {roadmapError ? (
            <p className="mt-5 text-sm text-amber-300">
              The roadmap could not be loaded. Check that the roadmap API is running.
            </p>
          ) : phases.length === 0 ? (
            <p className="mt-5 text-sm text-slate-400">
              No roadmap phases have been added yet.
            </p>
          ) : (
            <TopicProgressTracker
              userId={USER_ID}
              phases={phases}
            />
          )}
        </section>
      </div>
    </main>
  );
}
