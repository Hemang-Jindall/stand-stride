import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import {
  CircleCheck,
  CircleX,
} from "lucide-react";

export default function AdminAttendance() {

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