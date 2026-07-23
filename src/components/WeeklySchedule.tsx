import { Calendar } from "lucide-react";

export default function WeeklySchedule() {
  const week = [
    {
      day: "Mon",
      topic: "Career Guidance",
    },
    {
      day: "Tue",
      topic: "Resume Building",
    },
    {
      day: "Wed",
      topic: "Communication Skills",
    },
    {
      day: "Thu",
      topic: "Mock Interview",
    },
    {
      day: "Fri",
      topic: "Industry Visit",
    },
  ];

  return (
    <section className="mx-5 bg-white rounded-2xl shadow-sm p-5">

      <div className="flex items-center gap-2 mb-5">

        <Calendar
          size={18}
          className="text-emerald-600"
        />

        <h2 className="font-semibold text-slate-800">
          Weekly Schedule
        </h2>

      </div>

      <div className="space-y-3">

        {week.map((item) => (
          <div
            key={item.day}
            className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-none"
          >
            <span className="font-medium text-slate-800">
              {item.day}
            </span>

            <span className="text-slate-500 text-sm">
              {item.topic}
            </span>
          </div>
        ))}

      </div>

    </section>
  );
}