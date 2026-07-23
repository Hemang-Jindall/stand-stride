import { TrendingUp, Award, Clock } from "lucide-react";

export default function AttendanceStats() {
  return (
    <section className="mx-5 bg-white rounded-2xl shadow-sm p-5">

      <h2 className="font-semibold text-slate-800 mb-5">
        Statistics
      </h2>

      <div className="grid grid-cols-3 gap-4 text-center">

        <div>
          <TrendingUp
            size={22}
            className="mx-auto text-emerald-600 mb-2"
          />

          <p className="text-xl font-bold">
            96%
          </p>

          <p className="text-xs text-slate-500">
            Attendance
          </p>
        </div>

        <div>
          <Award
            size={22}
            className="mx-auto text-yellow-500 mb-2"
          />

          <p className="text-xl font-bold">
            A
          </p>

          <p className="text-xs text-slate-500">
            Grade
          </p>
        </div>

        <div>
          <Clock
            size={22}
            className="mx-auto text-blue-500 mb-2"
          />

          <p className="text-xl font-bold">
            42h
          </p>

          <p className="text-xs text-slate-500">
            Hours
          </p>
        </div>

      </div>

    </section>
  );
}