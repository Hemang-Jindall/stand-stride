import { Megaphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AnnouncementCard() {
  const navigate = useNavigate();

  return (
    <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

      <div className="flex items-center justify-between mb-3">

        <div className="flex items-center gap-2">
          <Megaphone
            size={18}
            className="text-emerald-600"
          />

          <h3 className="text-lg font-semibold text-slate-800">
            Announcements
          </h3>
        </div>

        <button
          onClick={() => navigate("/announcements")}
          className="text-xs text-emerald-600 font-medium hover:underline"
        >
          View All
        </button>

      </div>

      <div className="space-y-2">

        <div className="border-l-4 border-emerald-500 pl-3">
          <p className="font-medium text-slate-800">
            NGO Visit Tomorrow
          </p>

          <p className="text-sm text-slate-500">
            Report by 9:30 AM at the main gate.
          </p>
        </div>

        <div className="border-l-4 border-blue-500 pl-3">
          <p className="font-medium text-slate-800">
            Bring Your ID Card
          </p>

          <p className="text-sm text-slate-500">
            ID verification will be done before attendance.
          </p>
        </div>

      </div>

    </section>
  );
}