import { useLocation } from "react-router-dom";
import { useState } from "react";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import {
  User,
  CircleCheck,
  BookOpen,
  ClipboardCheck,
  BadgeCheck,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function Performance() {
  const location = useLocation();

  const student =
    location.state?.student || {
      id: "SNS001",
      name: "Hemang Jindal",
      batch: "B2",
      attendance: "96%",
      status: "Active",
      active: true,
    };

  const [remarks, setRemarks] = useState(
    `Excellent attendance and participation. Continue maintaining consistency throughout the internship.`
  );

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Future: Save to Firebase
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 overflow-y-auto">
        <section className="mx-5 bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3 mb-6">
            <User
              size={48}
              className="text-emerald-600"
            />

            <div>
              <h2 className="text-xl font-bold">
                {student.name}
              </h2>

              <p className="text-slate-500">
                {student.id} • Batch {student.batch}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">
            Internship Progress
          </h3>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-2">
                <span>Overall Progress</span>
                <span className="font-semibold">82%</span>
              </div>

              <div className="w-full h-3 bg-slate-200 rounded-full">
                <div className="w-[82%] h-3 rounded-full bg-emerald-600"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CircleCheck
                    size={18}
                    className="text-emerald-600"
                  />

                  <span className="font-medium">
                    Attendance
                  </span>
                </div>

                <p className="text-2xl font-bold">
                  {student.attendance}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen
                    size={18}
                    className="text-blue-600"
                  />

                  <span className="font-medium">
                    Topics
                  </span>
                </div>

                <p className="text-2xl font-bold">
                  8 / 10
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardCheck
                    size={18}
                    className="text-orange-600"
                  />

                  <span className="font-medium">
                    Assignments
                  </span>
                </div>

                <p className="text-2xl font-bold">
                  7 / 8
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BadgeCheck
                    size={18}
                    className="text-purple-600"
                  />

                  <span className="font-medium">
                    Certificate
                  </span>
                </div>

                <p className="font-semibold text-emerald-600">
                  Eligible
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-5 mt-5 bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-lg font-semibold mb-4">
            Mentor Remarks
          </h3>

          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={6}
            className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-emerald-500 resize-none"
            placeholder="Enter mentor remarks..."
          />

          <button
            onClick={handleSave}
            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 flex justify-center items-center gap-2 transition"
          >
            <Save size={18} />
            Save Remarks
          </button>

          {saved && (
            <div className="mt-4 flex items-center justify-center gap-2 text-emerald-600 font-medium">
              <CheckCircle2 size={18} />
              Remarks saved successfully.
            </div>
          )}
        </section>
      </main>

      <AdminBottomNavigation />
    </MobileLayout>
  );
}