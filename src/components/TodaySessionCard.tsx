import { CalendarDays, Clock3, MapPin } from "lucide-react";

export default function TodaySessionCard() {
  return (
    <section className="mx-5 bg-white rounded-2xl shadow-sm p-5">

      <div className="flex items-center gap-2 mb-4">

        <CalendarDays
          size={18}
          className="text-emerald-600"
        />

        <h2 className="font-semibold text-slate-800">
          Today's Session
        </h2>

      </div>

      <h1 className="text-2xl font-bold">
        Career Guidance
      </h1>

      <div className="space-y-3 mt-5">

        <div className="flex items-center gap-3">
          <Clock3
            size={18}
            className="text-slate-500"
          />

          <span>10:00 AM – 12:00 PM</span>
        </div>

        <div className="flex items-center gap-3">
          <MapPin
            size={18}
            className="text-slate-500"
          />

          <span>Room 102</span>
        </div>

      </div>

    </section>
  );
}