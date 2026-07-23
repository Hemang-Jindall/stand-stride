import {
  CheckCircle2,
  XCircle,
  Circle,
} from "lucide-react";

export default function AttendanceHistory() {
  const records = [
    {
      date: "12 Jul 2026",
      status: "Present",
      icon: <CheckCircle2 size={18} className="text-emerald-600" />,
    },
    {
      date: "11 Jul 2026",
      status: "Present",
      icon: <CheckCircle2 size={18} className="text-emerald-600" />,
    },
    {
      date: "10 Jul 2026",
      status: "Absent",
      icon: <XCircle size={18} className="text-red-500" />,
    },
    {
      date: "09 Jul 2026",
      status: "Leave",
      icon: <Circle size={18} className="fill-yellow-400 text-yellow-400" />,
    },
  ];

  return (
    <section className="mx-5 bg-white rounded-2xl shadow-sm p-5">

      <h2 className="font-semibold text-slate-800 mb-5">
        Recent Attendance
      </h2>

      <div className="space-y-4">

        {records.map((record, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-none last:pb-0"
          >
            <div className="flex items-center gap-3">
              {record.icon}

              <div>
                <p className="font-medium text-slate-800">
                  {record.status}
                </p>

                <p className="text-sm text-slate-500">
                  {record.date}
                </p>
              </div>
            </div>
          </div>
        ))}

      </div>

    </section>
  );
}