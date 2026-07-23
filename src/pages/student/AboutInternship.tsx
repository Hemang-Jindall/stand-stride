import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import {
  Info,
  CalendarDays,
  Building2,
} from "lucide-react";

export default function AboutInternship() {
  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4">

        <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

          <div className="flex items-center gap-2 mb-5">

            <Info
              size={20}
              className="text-emerald-600"
            />

            <h2 className="text-xl font-semibold">
              About Internship
            </h2>

          </div>

          <div className="space-y-5">

            <div className="flex gap-3">

              <Building2
                size={18}
                className="text-emerald-600 mt-1"
              />

              <div>

                <p className="font-medium">
                  Organization
                </p>

                <p className="text-sm text-slate-500">
                  Stand & Stride Foundation
                </p>

              </div>

            </div>

            <div className="flex gap-3">

              <CalendarDays
                size={18}
                className="text-emerald-600 mt-1"
              />

              <div>

                <p className="font-medium">
                  Duration
                </p>

                <p className="text-sm text-slate-500">
                  1 June 2026 – 31 July 2026
                </p>

              </div>

            </div>

            <div>

              <p className="font-medium mb-2">
                Description
              </p>

              <p className="text-sm text-slate-500 leading-6">
                The Stand & Stride Internship Program
                focuses on career readiness,
                communication skills, professional
                development, and real-world
                exposure through structured
                sessions and mentoring.
              </p>

            </div>

          </div>

        </section>

      </main>

      <BottomNavigation />

    </MobileLayout>
  );
}