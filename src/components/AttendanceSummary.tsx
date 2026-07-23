import { ClipboardCheck } from "lucide-react";

export default function AttendanceSummary() {
  return (
    <section className="mx-5 bg-white rounded-2xl shadow-sm p-5">

      <div className="flex items-center gap-2 mb-5">
        <ClipboardCheck
          size={18}
          className="text-emerald-600"
        />

        <h2 className="font-semibold text-slate-800">
          Attendance Summary
        </h2>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold text-emerald-600">
          96%
        </h1>

        <p className="text-slate-500 mt-2">
          Excellent Attendance
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">

        <div>
          <p className="text-2xl font-bold">
            18
          </p>

          <p className="text-sm text-slate-500">
            Present
          </p>
        </div>

        <div>
          <p className="text-2xl font-bold">
            1
          </p>

          <p className="text-sm text-slate-500">
            Absent
          </p>
        </div>

        <div>
          <p className="text-2xl font-bold">
            0
          </p>

          <p className="text-sm text-slate-500">
            Leave
          </p>
        </div>

      </div>

    </section>
  );
}