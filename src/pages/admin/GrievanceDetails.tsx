import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import {
  TriangleAlert,
  User,
  CalendarDays,
  CircleCheck,
} from "lucide-react";

export default function GrievanceDetails() {
  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        <section className="mx-5 bg-white rounded-xl shadow-sm p-5">

          <div className="flex items-center gap-2 mb-5">

            <TriangleAlert
              size={22}
              className="text-red-500"
            />

            <h2 className="text-xl font-bold">
              Grievance Details
            </h2>

          </div>

          <div className="space-y-4">

            <div className="flex items-center gap-3">

              <User
                size={18}
                className="text-slate-500"
              />

              <span>Hemang Jindal</span>

            </div>

            <div className="flex items-center gap-3">

              <CalendarDays
                size={18}
                className="text-slate-500"
              />

              <span>18 Jul 2026</span>

            </div>

            <div>

              <p className="text-sm text-slate-500 mb-2">
                Category
              </p>

              <p className="font-medium">
                Infrastructure
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500 mb-2">
                Description
              </p>

              <p>
                The projector in Lab 3 has not been working
                for the last three sessions, making it
                difficult to follow demonstrations.
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500 mb-2">
                Status
              </p>

              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                Pending
              </span>

            </div>

          </div>

          <button
            className="mt-6 w-full bg-emerald-600 text-white rounded-xl py-3 flex items-center justify-center gap-2"
          >

            <CircleCheck size={18} />

            Mark as Resolved

          </button>

        </section>

      </main>

      <AdminBottomNavigation />

    </MobileLayout>
  );
}