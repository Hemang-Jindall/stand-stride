import { ClipboardCheck } from "lucide-react";

export default function AttendanceCard() {
  return (
    <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

      <div className="flex items-center gap-2 mb-3">
        <ClipboardCheck
          size={18}
          className="text-emerald-600"
        />

        <h3 className="text-lg font-semibold text-slate-800">
          Attendance
        </h3>
      </div>

      <div className="flex items-center justify-between">

        <div>
          <p className="text-2xl font-bold text-slate-900">
            96%
          </p>

          <p className="text-sm text-slate-500">
            Overall Attendance
          </p>
        </div>

        <div className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-medium">
          Present Today
        </div>

      </div>

    </section>
  );
}