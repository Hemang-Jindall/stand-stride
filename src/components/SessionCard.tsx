import {
  CalendarDays,
  Clock3,
  MapPin,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function SessionCard() {
  const navigate = useNavigate();

  return (
    <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

      <div className="flex items-center gap-2 mb-3">
        <CalendarDays
          size={18}
          className="text-emerald-600"
        />

        <h3 className="text-lg font-semibold text-slate-800">
          Today's Session
        </h3>
      </div>

      <h2 className="text-lg font-bold text-slate-900">
        Career Guidance
      </h2>

      <div className="mt-4 space-y-2">

        <div className="flex items-center gap-2">
          <Clock3
            size={18}
            className="text-slate-500"
          />
          <span className="text-sm">10:00 AM – 12:00 PM</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin
            size={18}
            className="text-slate-500"
          />
          <span className="text-sm">Room 102</span>
        </div>

        <div className="flex items-center gap-2">
          <User
            size={18}
            className="text-slate-500"
          />
          <span className="text-sm">Rashmi Ma'am</span>
        </div>

      </div>

      <button
        onClick={() => navigate("/schedule")}
        className="w-full mt-4 rounded-xl bg-emerald-600 text-white py-2.5 font-medium"
      >
        View Schedule
      </button>

    </section>
  );
}