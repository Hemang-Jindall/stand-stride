import {
  useEffect,
  useState,
} from "react";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import StudentProfileCard from "../../components/StudentProfileCard";
import PersonalInformationCard from "../../components/PersonalInfoCard";
import MentorCard from "../../components/MentorCard";

import api from "../../api/api";

export interface StudentProfile {
  id: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;

  batch: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;

    venue: {
      id: string;
      name: string;
      address: string | null;
    };
  };

  mentor: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  } | null;
}

export default function Profile() {
  const [student, setStudent] =
    useState<StudentProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadProfile() {
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
          await api.get<StudentProfile>(
            "/students/me",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setStudent(response.data);

        // Keep the login snapshot current too.
        localStorage.setItem(
          "student",
          JSON.stringify(response.data)
        );
      } catch (error: any) {
        console.error(
          "LOAD PROFILE ERROR:",
          error
        );

        setError(
          error.response?.data?.message ??
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 space-y-4 overflow-y-auto">

        {loading && (
          <section className="mx-5 bg-white rounded-xl shadow-sm p-6 text-center text-slate-500">
            Loading profile...
          </section>
        )}

        {!loading && error && (
          <section className="mx-5 bg-red-50 rounded-xl p-4 text-sm text-red-600">
            {error}
          </section>
        )}

        {!loading &&
          !error &&
          student && (
            <>
              <StudentProfileCard
                student={student}
              />

              <PersonalInformationCard
                student={student}
              />

              <MentorCard
                mentor={student.mentor}
              />
            </>
          )}

      </main>

      <BottomNavigation />
    </MobileLayout>
  );
}