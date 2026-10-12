"use client";

import { useEffect, useState } from "react";

type Career = {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
};

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCareers() {
      try {
        const response = await fetch("http://localhost:3001/career-paths");

        if (!response.ok) {
          throw new Error("Failed to fetch career paths");
        }

        const data = await response.json();
        setCareers(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load career paths.");
      } finally {
        setLoading(false);
      }
    }

    fetchCareers();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-400">
            Career Explorer
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Explore Career Paths
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Explore different technology careers and understand which path
            could be right for your background and goals.
          </p>
        </div>

        {loading && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-slate-400">Loading career paths...</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-900 bg-red-950/30 p-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {careers.map((career) => (
              <div
                key={career.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-blue-500"
              >
                <div className="mb-4">
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                    {career.category || "Technology"}
                  </span>
                </div>

                <h2 className="text-xl font-semibold">
                  {career.name}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {career.description || "No description available."}
                </p>

              <button
  onClick={() => {
    window.location.href = `/careers/${career.id}`;
  }}
  className="mt-6 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
>
  Explore Career
</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}