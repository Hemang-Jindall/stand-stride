import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import {
  BadgeCheck,
  Download,
} from "lucide-react";

export default function AdminCertificates() {

  const certificates = [
    {
      student: "Hemang Jindal",
      batch: "B2",
      eligible: true,
    },
    {
      student: "Aarav Sharma",
      batch: "B1",
      eligible: true,
    },
    {
      student: "Priya Singh",
      batch: "B3",
      eligible: false,
    },
  ];

  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        <section className="mx-5">

          <div className="flex items-center gap-2 mb-5">

            <BadgeCheck
              size={22}
              className="text-emerald-600"
            />

            <h1 className="text-2xl font-bold">
              Certificates
            </h1>

          </div>

          <div className="space-y-3">

            {certificates.map((student) => (

              <div
                key={student.student}
                className="bg-white rounded-xl shadow-sm p-4"
              >

                <div className="flex justify-between items-center">

                  <div>

                    <h3 className="font-semibold">
                      {student.student}
                    </h3>

                    <p className="text-sm text-slate-500">
                      Batch {student.batch}
                    </p>

                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.eligible
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {student.eligible
                      ? "Eligible"
                      : "Not Eligible"}
                  </span>

                </div>

                <button
                  disabled={!student.eligible}
                  className={`mt-4 w-full rounded-lg py-2 flex items-center justify-center gap-2 ${
                    student.eligible
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >

                  <Download size={18} />

                  Generate Certificate

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