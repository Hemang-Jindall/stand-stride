import {
  useEffect,
  useState,
} from "react";

import {
  UserCheck,
  Mail,
  Phone,
} from "lucide-react";

import api from "../api/api";

interface Mentor {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}

export default function MentorCard() {
  const [mentor, setMentor] =
    useState<Mentor | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadMentor() {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        if (!token) {
          setError(
            "You are not logged in."
          );
          return;
        }

        const response =
          await api.get(
            "/mentors/me",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setMentor(
          response.data.mentor
        );
      } catch (error: any) {
        console.error(
          "LOAD MENTOR ERROR:",
          error
        );

        setError(
          error.response?.data?.message ??
            "Failed to load mentor."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMentor();
  }, []);

  return (
    <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

      <div className="flex items-center gap-2 mb-5">

        <UserCheck
          size={20}
          className="text-emerald-600"
        />

        <h2 className="text-lg font-semibold">
          Your Mentor
        </h2>

      </div>

      {loading && (
        <p className="text-sm text-slate-500">
          Loading mentor...
        </p>
      )}

      {!loading && error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        !mentor && (
          <div className="text-center py-4">

            <UserCheck
              size={32}
              className="text-slate-400 mx-auto"
            />

            <p className="font-medium mt-2">
              No mentor assigned yet
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Your assigned mentor will
              appear here.
            </p>

          </div>
        )}

      {!loading &&
        !error &&
        mentor && (
          <div>

            <p className="font-semibold text-lg">
              {mentor.name}
            </p>

            <div className="space-y-3 mt-4">

              {mentor.email && (
                <div className="flex items-center gap-3">

                  <Mail
                    size={18}
                    className="text-emerald-600"
                  />

                  <span className="text-sm break-all">
                    {mentor.email}
                  </span>

                </div>
              )}

              {mentor.phone && (
                <div className="flex items-center gap-3">

                  <Phone
                    size={18}
                    className="text-emerald-600"
                  />

                  <span className="text-sm">
                    {mentor.phone}
                  </span>

                </div>
              )}

            </div>

          </div>
        )}

    </section>
  );
}