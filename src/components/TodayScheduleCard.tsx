import {
  CalendarDays,
  Clock3,
  MapPin,
  User,
} from "lucide-react";

export default function TodayScheduleCard() {
  return (
    <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

      <div className="flex items-center gap-2 mb-4">

        <CalendarDays
          size={18}
          className="text-emerald-600"
        />

        <h2 className="text-lg font-semibold">
          Today's Schedule
        </h2>

      </div>

      <div className="space-y-4">

        <div className="border-l-4 border-emerald-500 pl-3">

          <h3 className="font-semibold">
            Career Guidance
          </h3>

          <div className="mt-2 space-y-2 text-sm text-slate-600">

            <div className="flex items-center gap-2">
              <Clock3 size={16} />
              <span>10:00 AM – 12:00 PM</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>Room 102</span>
            </div>

            <div className="flex items-center gap-2">
              <User size={16} />
              <span>Rashmi Ma'am</span>
            </div>

          </div>

        </div>

        <div className="border-l-4 border-blue-500 pl-3">

          <p className="font-medium">
            Next Activity
          </p>

          <p className="text-sm text-slate-500">
            Group Discussion • 1:00 PM
          </p>

        </div>

      </div>

    </section>
  );
}