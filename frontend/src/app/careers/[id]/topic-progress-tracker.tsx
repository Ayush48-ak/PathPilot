
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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

type TopicProgress = {
  id: number;
  userId: number;
  topicId: number;
  completed: boolean;
  completedAt: string | null;
};

const API_URL = "http://localhost:3001";

export default function TopicProgressTracker({
  userId,
  phases,
}: {
  userId: number;
  phases: RoadmapPhase[];
}) {
  const [progress, setProgress] = useState<TopicProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingTopics, setSavingTopics] = useState<number[]>([]);
  const [error, setError] = useState("");

  const loadProgress = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/progress`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Could not load saved progress.");
      }

      setProgress(await response.json());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load progress.",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadProgress();
  }, [loadProgress]);

  const allTopics = useMemo(
    () => phases.flatMap((phase) => phase.topics),
    [phases],
  );

  const completedTopicIds = new Set(
    progress.filter((item) => item.completed).map((item) => item.topicId),
  );

  const completedCount = allTopics.filter((topic) =>
    completedTopicIds.has(topic.id),
  ).length;

  const percentage =
    allTopics.length === 0
      ? 0
      : Math.round((completedCount / allTopics.length) * 100);

  async function toggleTopic(topicId: number, completed: boolean) {
    setError("");
    setSavingTopics((current) => [...current, topicId]);

    try {
      const response = await fetch(
        `${API_URL}/users/${userId}/progress/${topicId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed }),
        },
      );

      if (!response.ok) {
        throw new Error("Could not save progress.");
      }

      const saved: TopicProgress = await response.json();

      setProgress((current) => [
        ...current.filter((item) => item.topicId !== topicId),
        saved,
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save progress.",
      );
    } finally {
      setSavingTopics((current) =>
        current.filter((id) => id !== topicId),
      );
    }
  }

  return (
    <div className="mt-6">
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="mb-8 rounded-xl border border-slate-800 bg-slate-950 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Overall progress</p>
            <p className="mt-1 text-2xl font-bold text-blue-400">
              {percentage}%
            </p>
          </div>
          <p className="text-sm text-slate-400">
            {completedCount} of {allTopics.length} topics completed
          </p>
        </div>

        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Roadmap completion"
        >
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {loading && (
        <p className="mb-4 text-sm text-slate-400">
          Loading saved progress...
        </p>
      )}

      <div className="space-y-6">
        {phases.map((phase, index) => {
          const phaseCompleted = phase.topics.filter((topic) =>
            completedTopicIds.has(topic.id),
          ).length;

          return (
            <article
              key={phase.id}
              className="rounded-xl border border-slate-800 bg-slate-950 p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-blue-400">
                    Phase {index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">
                    {phase.title}
                  </h3>
                </div>

                <div className="text-right">
                  {phase.duration && (
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      {phase.duration}
                    </span>
                  )}
                  <p className="mt-2 text-xs text-slate-400">
                    {phaseCompleted}/{phase.topics.length} completed
                  </p>
                </div>
              </div>

              {phase.description && (
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {phase.description}
                </p>
              )}

              <div className="mt-5 space-y-3">
                {phase.topics.map((topic) => {
                  const completed = completedTopicIds.has(topic.id);
                  const saving = savingTopics.includes(topic.id);

                  return (
                    <div
                      key={topic.id}
                      className="rounded-lg border border-slate-800 p-4"
                    >
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={completed}
                          disabled={saving}
                          onChange={(event) =>
                            void toggleTopic(topic.id, event.target.checked)
                          }
                          className="mt-1 h-4 w-4 accent-emerald-500"
                        />

                        <span className="min-w-0 flex-1">
                          <span
                            className={`block font-medium ${
                              completed
                                ? "text-emerald-400 line-through"
                                : "text-slate-100"
                            }`}
                          >
                            {topic.title}
                          </span>

                          {topic.description && (
                            <span className="mt-2 block text-sm leading-6 text-slate-400">
                              {topic.description}
                            </span>
                          )}

                          <span className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                            {topic.estimatedHours != null && (
                              <span>{topic.estimatedHours} estimated hours</span>
                            )}
                            {saving && <span>Saving...</span>}
                            {!saving && completed && (
                              <span className="text-emerald-400">Completed</span>
                            )}
                          </span>

                          {topic.resourceUrl && (
                            <a
                              href={topic.resourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(event) => event.stopPropagation()}
                              className="mt-3 inline-block text-sm text-blue-400 underline underline-offset-4 hover:text-blue-300"
                            >
                              Learning resource ↗
                            </a>
                          )}
                        </span>
                      </label>
                    </div>
                  );
                })}

                {phase.topics.length === 0 && (
                  <p className="text-sm text-slate-400">
                    No topics have been added to this phase yet.
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
