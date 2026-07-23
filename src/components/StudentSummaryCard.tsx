import {
  User,
  Users,
  CalendarDays,
  ClipboardCheck,
} from "lucide-react";

export default function StudentSummaryCard() {
  return (
    <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

      <h2 className="text-lg font-semibold mb-5">
        Student Summary
      </h2>

      <div className="space-y-4">

        <div className="flex items-center gap-3">

          <User
            size={18}
            className="text-emerald-600"
          />

          <div className="flex justify-between w-full">

            <span className="text-slate-500">
              Student
            </span>

            <span className="font-medium">
              Hemang Jindal
            </span>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <Users
            size={18}
            className="text-emerald-600"
          />

          <div className="flex justify-between w-full">

            <span className="text-slate-500">
              Batch
            </span>

            <span className="font-medium">
              B2
            </span>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <User
            size={18}
            className="text-emerald-600"
          />

          <div className="flex justify-between w-full">

            <span className="text-slate-500">
              Mentor
            </span>

            <span className="font-medium">
              Rashmi Ma'am
            </span>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <ClipboardCheck
            size={18}
            className="text-emerald-600"
          />

          <div className="flex justify-between w-full">

            <span className="text-slate-500">
              Attendance
            </span>

            <span className="font-semibold text-emerald-600">
              96%
            </span>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <CalendarDays
            size={18}
            className="text-emerald-600"
          />

          <div className="flex justify-between w-full">

            <span className="text-slate-500">
              Today's Session
            </span>

            <span className="font-medium">
              Career Guidance
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}