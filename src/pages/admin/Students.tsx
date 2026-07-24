import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import {
  Search,
  CircleCheck,
  CircleAlert,
  ChevronRight,
} from "lucide-react";

export default function Students() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All");

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

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.id.toLowerCase().includes(search.toLowerCase());

      const matchesBatch =
        selectedBatch === "All" || student.batch === selectedBatch;

      return matchesSearch && matchesBatch;
    });
  }, [search, selectedBatch]);

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 overflow-y-auto">
        <section className="mx-5">
          <h1 className="text-2xl font-bold mb-4">
            Students
          </h1>

          <div className="relative mb-4">
            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="mb-5">
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 outline-none focus:border-emerald-500"
            >
              <option value="All">All Batches</option>
              <option value="B1">Batch B1</option>
              <option value="B2">Batch B2</option>
              <option value="B3">Batch B3</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() =>
                    navigate("/admin/student", {
                      state: { student },
                    })
                  }
                  className="w-full bg-white rounded-xl shadow-sm p-4 flex justify-between items-center active:scale-95 transition"
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
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
                No students found.
              </div>
            )}
          </div>
        </section>
      </main>

      <AdminBottomNavigation />
    </MobileLayout>
  );
}