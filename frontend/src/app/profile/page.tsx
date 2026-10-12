
"use client";

import { useEffect, useState } from "react";

const API = "http://localhost:3001";

type UserProfile = {
  id: number;
  userId: number;
  education: string | null;
  currentDegree: string | null;
  graduationYear: number | null;
  previousBackground: string | null;
  experienceLevel: string | null;
  careerGoal: string | null;
};

type Career = {
  id: number;
  name: string;
  category: string;
  description: string;
};

type ProfileForm = {
  education: string;
  currentDegree: string;
  graduationYear: string;
  previousBackground: string;
  experienceLevel: string;
  careerGoal: string;
};

const emptyForm: ProfileForm = {
  education: "",
  currentDegree: "",
  graduationYear: "",
  previousBackground: "",
  experienceLevel: "Beginner",
  careerGoal: "",
};

function toFormData(profile: UserProfile): ProfileForm {
  return {
    education: profile.education ?? "",
    currentDegree: profile.currentDegree ?? "",
    graduationYear: profile.graduationYear?.toString() ?? "",
    previousBackground: profile.previousBackground ?? "",
    experienceLevel: profile.experienceLevel ?? "Beginner",
    careerGoal: profile.careerGoal ?? "",
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [careers, setCareers] = useState<Career[]>([]);
  const [formData, setFormData] = useState<ProfileForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPage() {
      try {
        const [profilesResponse, careersResponse] = await Promise.all([
          fetch(`${API}/profiles`, { cache: "no-store" }),
          fetch(`${API}/career-paths`, { cache: "no-store" }),
        ]);

        if (!profilesResponse.ok) {
          throw new Error("Failed to fetch profile.");
        }

        if (!careersResponse.ok) {
          throw new Error("Failed to fetch career paths.");
        }

        const profiles: UserProfile[] = await profilesResponse.json();
        const availableCareers: Career[] = await careersResponse.json();

        if (!active) return;

        setCareers(availableCareers);

        const currentProfile = profiles[0];

        if (currentProfile) {
          setProfile(currentProfile);
          setFormData(toFormData(currentProfile));
        } else {
          setError("No profile was found. Create a profile before continuing.");
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Failed to load profile."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPage();

    return () => {
      active = false;
    };
  }, []);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSave() {
    if (!profile) return;

    const graduationYear =
      formData.graduationYear.trim() === ""
        ? null
        : Number(formData.graduationYear);

    if (
      graduationYear !== null &&
      (!Number.isInteger(graduationYear) ||
        graduationYear < 1950 ||
        graduationYear > 2100)
    ) {
      setError("Enter a valid graduation year.");
      return;
    }

    if (
      formData.careerGoal &&
      !careers.some((career) => career.name === formData.careerGoal)
    ) {
      setError("Select a career from the available career paths.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API}/profiles/${profile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          education: formData.education || null,
          currentDegree: formData.currentDegree || null,
          graduationYear,
          previousBackground: formData.previousBackground || null,
          experienceLevel: formData.experienceLevel || null,
          careerGoal: formData.careerGoal || null,
        }),
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(details || "Failed to update profile.");
      }

      const updatedProfile: UserProfile = await response.json();

      setProfile(updatedProfile);
      setFormData(toFormData(updatedProfile));
      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-4xl text-slate-400">
          Loading profile...
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="mt-4 text-red-400">
            {error || "Profile not found."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-blue-400">
              PathPilot
            </p>
            <h1 className="mt-2 text-4xl font-bold">Your Profile</h1>
            <p className="mt-3 text-slate-400">
              Manage your education, background, experience, and career goal.
            </p>
          </div>

          {!editing && (
            <button
              onClick={() => {
                setError("");
                setMessage("");
                setEditing(true);
              }}
              className="rounded-lg bg-blue-500 px-5 py-3 font-semibold transition hover:bg-blue-600"
            >
              Edit Profile
            </button>
          )}
        </header>

        {message && (
          <div
            role="status"
            className="mb-6 rounded-lg border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-300"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-800 bg-red-950/30 p-4 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {!editing ? (
          <section className="grid gap-6 md:grid-cols-2">
            {[
              ["Education", profile.education],
              ["Current Degree", profile.currentDegree],
              ["Graduation Year", profile.graduationYear],
              ["Previous Background", profile.previousBackground],
              ["Experience Level", profile.experienceLevel],
              ["Career Goal", profile.careerGoal],
            ].map(([label, value]) => (
              <article
                key={String(label)}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6"
              >
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-2 text-lg font-semibold">
                  {value ?? "Not provided"}
                </p>
              </article>
            ))}
          </section>
        ) : (
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="education"
                  className="mb-2 block text-sm text-slate-400"
                >
                  Education
                </label>
                <input
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="currentDegree"
                  className="mb-2 block text-sm text-slate-400"
                >
                  Current Degree
                </label>
                <input
                  id="currentDegree"
                  name="currentDegree"
                  value={formData.currentDegree}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="graduationYear"
                  className="mb-2 block text-sm text-slate-400"
                >
                  Graduation Year
                </label>
                <input
                  id="graduationYear"
                  name="graduationYear"
                  type="number"
                  min="1950"
                  max="2100"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="previousBackground"
                  className="mb-2 block text-sm text-slate-400"
                >
                  Previous Background
                </label>
                <input
                  id="previousBackground"
                  name="previousBackground"
                  value={formData.previousBackground}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="experienceLevel"
                  className="mb-2 block text-sm text-slate-400"
                >
                  Experience Level
                </label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="careerGoal"
                  className="mb-2 block text-sm text-slate-400"
                >
                  Target Career
                </label>
                <select
                  id="careerGoal"
                  name="careerGoal"
                  value={formData.careerGoal}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="">Choose a target career</option>
                  {careers.map((career) => (
                    <option key={career.id} value={career.name}>
                      {career.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-slate-500">
                  Choose from the career paths available in PathPilot.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-blue-500 px-6 py-3 font-semibold transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={() => {
                  setFormData(toFormData(profile));
                  setEditing(false);
                  setError("");
                  setMessage("");
                }}
                disabled={saving}
                className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
