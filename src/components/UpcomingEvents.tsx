import { CalendarPlus } from "lucide-react";

export default function UpcomingEvents() {
  const events = [
    {
      title: "Industry Visit",
      date: "18 Jul 2026",
    },
    {
      title: "Resume Review",
      date: "20 Jul 2026",
    },
    {
      title: "Final Presentation",
      date: "28 Jul 2026",
    },
  ];

  return (
    <section className="mx-5 bg-white rounded-2xl shadow-sm p-5">

      <div className="flex items-center gap-2 mb-5">

        <CalendarPlus
          size={18}
          className="text-emerald-600"
        />

        <h2 className="font-semibold text-slate-800">
          Upcoming Events
        </h2>

      </div>

      <div className="space-y-4">

        {events.map((event) => (
          <div
            key={event.title}
            className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-none last:pb-0"
          >
            <div>
              <p className="font-medium text-slate-800">
                {event.title}
              </p>

              <p className="text-sm text-slate-500">
                {event.date}
              </p>
            </div>

            <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
              Upcoming
            </span>
          </div>
        ))}

      </div>

    </section>
  );
}