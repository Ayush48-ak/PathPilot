"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Failed to fetch users:", error);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20 lg:px-8">
        
        {/* Brand */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            PathPilot
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Your personalized career navigation platform
          </p>
        </div>

        {/* Hero */}
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-blue-400">
            Career Navigation
          </p>

          <h2 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Find the right career path.
            <span className="block text-blue-400">
              Build the skills to reach it.
            </span>
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            PathPilot helps you understand your background, choose a target
            career, identify your skill gaps, and follow a personalized
            roadmap toward your goal.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600">
              Build My Career Path
            </button>

            <button className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:bg-slate-900">
              Explore Career Paths
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-lg font-semibold">
              Career Discovery
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Discover career options based on your education, background,
              interests, and goals.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-lg font-semibold">
              Skill Gap Analysis
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Compare your current skills with the skills required for your
              target role.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-lg font-semibold">
              Learning Roadmap
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Follow a structured roadmap with skills, projects, and milestones
              to become job-ready.
            </p>
          </div>
        <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold">
            Users from Backend
          </h3>

          <pre className="mt-4 overflow-auto text-sm text-slate-400">
            {JSON.stringify(users, null, 2)}
          </pre>
        </div>
        </div>
      </section>
    </main>
  );
}