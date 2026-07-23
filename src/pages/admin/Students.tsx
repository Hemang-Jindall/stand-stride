import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import {
  Search,
  CircleCheck,
  CircleAlert,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Students() {

  const navigate = useNavigate();

  const students = [
    {
      id: "SNS001",
      name: "Hemang Jindal",
      batch: "B2",
      attendance: "96%",
      status: "Active",
      active: true,
    },
    {
      id: "SNS002",
      name: "Aarav Sharma",
      batch: "B1",
      attendance: "92%",
      status: "Active",
      active: true,
    },
    {
      id: "SNS003",
      name: "Priya Singh",
      batch: "B3",
      attendance: "81%",
      status: "Inactive",
      active: false,
    },
  ];

  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        <section className="mx-5">

          <h1 className="text-2xl font-bold mb-4">
            Students
          </h1>

          <div className="relative mb-5">

            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search students..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 outline-none focus:border-emerald-500"
            />

          </div>

          <div className="space-y-3">

            {students.map((student) => (

              <button
                key={student.id}
                onClick={() =>
                  navigate("/admin/student")
                }
                className="w-full bg-white rounded-xl shadow-sm p-4 flex justify-between items-center"
              >

                <div>

                  <h3 className="font-semibold text-left">
                    {student.name}
                  </h3>

                  <p className="text-sm text-slate-500 text-left">
                    {student.id} • Batch {student.batch}
                  </p>

                </div>

                <div className="flex items-center gap-3">

                  <div className="text-right">

                    <p className="font-semibold">
                      {student.attendance}
                    </p>

                    <div className="flex justify-end items-center gap-1">

                      {student.active ? (

                        <CircleCheck
                          size={16}
                          className="text-emerald-600"
                        />

                      ) : (

                        <CircleAlert
                          size={16}
                          className="text-red-500"
                        />

                      )}

                      <span className="text-xs">
                        {student.status}
                      </span>

                    </div>

                  </div>

                  <ChevronRight
                    size={18}
                    className="text-slate-400"
                  />

                </div>

              </button>

            ))}

          </div>

        </section>

      </main>

      <AdminBottomNavigation />

    </MobileLayout>
  );
}