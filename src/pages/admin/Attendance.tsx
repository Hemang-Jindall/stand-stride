import { useState } from "react";

import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import {
  CalendarDays,
  CircleCheck,
  CircleX,
} from "lucide-react";

export default function AdminAttendance() {
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);

  const attendance = [
    {
      name: "Hemang Jindal",
      batch: "B2",
      status: "Present",
      present: true,
    },
    {
      name: "Aarav Sharma",
      batch: "B1",
      status: "Present",
      present: true,
    },
    {
      name: "Priya Singh",
      batch: "B3",
      status: "Absent",
      present: false,
    },
  ];

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 overflow-y-auto">
        <section className="mx-5">
          <h1 className="text-2xl font-bold mb-5">
            Attendance
          </h1>

          <div className="bg-white rounded-xl shadow-sm p-4 mb-5">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-2">
              <CalendarDays size={18} />
              Select Date
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-3">
            {attendance.map((student) => (
              <div
                key={student.name}
                className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">
                    {student.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    Batch {student.batch}
                  </p>
                </div>

                <button
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-white ${
                    student.present
                      ? "bg-emerald-600"
                      : "bg-red-500"
                  }`}
                >
                  {student.present ? (
                    <CircleCheck size={18} />
                  ) : (
                    <CircleX size={18} />
                  )}

                  {student.status}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <AdminBottomNavigation />
    </MobileLayout>
  );
}