import {
  CalendarDays,
  Clock3,
  MapPin,
  User,
  ClipboardCheck,
  Megaphone,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function TodaysOverviewCard() {
  const navigate = useNavigate();

  return (
    <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

      <div className="flex items-center gap-2 mb-4">
        <CalendarDays
          size={18}
          className="text-emerald-600"
        />

        <h2 className="text-lg font-semibold">
          Today's Overview
        </h2>
      </div>

      {/* Session */}

      <div className="space-y-2 mb-4">

        <p className="font-semibold text-slate-900">
          Career Guidance
        </p>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock3 size={16} />
          <span>10:00 AM – 12:00 PM</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin size={16} />
          <span>Room 102</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <User size={16} />
          <span>Rashmi Ma'am</span>
        </div>

      </div>

      <hr className="my-4" />

      {/* Attendance */}

      <div className="flex items-center justify-between mb-4">

        <div className="flex items-center gap-2">

          <ClipboardCheck
            size={18}
            className="text-emerald-600"
          />

          <span className="font-medium">
            Attendance
          </span>

        </div>

        <span className="font-bold text-emerald-600">
          96%
        </span>

      </div>

      <hr className="my-4" />

      {/* Announcement */}

      <div className="flex items-start gap-3">

        <Megaphone
          size={18}
          className="text-emerald-600 mt-1"
        />

        <div>

          <p className="font-medium">
            NGO Visit Tomorrow
          </p>

          <p className="text-sm text-slate-500">
            Report by 9:30 AM at the main gate.
          </p>

        </div>

      </div>

      {/* Action Buttons */}

      <div className="grid grid-cols-2 gap-3 mt-5">

        <button
          onClick={() => navigate("/schedule")}
          className="rounded-xl bg-emerald-600 text-white py-2.5 font-medium hover:bg-emerald-700 transition"
        >
          View Schedule
        </button>

        <button
          onClick={() => navigate("/announcements")}
          className="rounded-xl border border-emerald-600 text-emerald-600 py-2.5 font-medium hover:bg-emerald-50 transition"
        >
          View All
        </button>

      </div>

    </section>
  );
}