import {
  Briefcase,
  CalendarDays,
  Building2,
  Users,
} from "lucide-react";

export default function InternshipInfoCard() {
  return (
    <section className="mx-5 bg-white rounded-2xl shadow-sm p-5">

      <h2 className="font-semibold text-slate-800 mb-5">
        Internship Information
      </h2>

      <div className="space-y-4">

        <div className="flex items-center gap-3">
          <Briefcase
            size={18}
            className="text-emerald-600"
          />

          <div>
            <p className="text-xs text-slate-500">
              Internship
            </p>

            <p className="font-medium">
              Junior Internship
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Building2
            size={18}
            className="text-emerald-600"
          />

          <div>
            <p className="text-xs text-slate-500">
              Organization
            </p>

            <p className="font-medium">
              Stand & Stride Foundation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Users
            size={18}
            className="text-emerald-600"
          />

          <div>
            <p className="text-xs text-slate-500">
              Batch
            </p>

            <p className="font-medium">
              B2
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CalendarDays
            size={18}
            className="text-emerald-600"
          />

          <div>
            <p className="text-xs text-slate-500">
              Duration
            </p>

            <p className="font-medium">
              1 Jun 2026 – 31 Jul 2026
            </p>
          </div>
        </div>

      </div>

    </section>
  );
}