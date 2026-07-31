import {
  UserCircle2,
  Mail,
  Phone,
  IdCard,
  Building2,
  CalendarDays,
} from "lucide-react";

import type {
  StudentProfile,
} from "../pages/student/Profile";

interface Props {
  student: StudentProfile;
}

export default function StudentProfileCard({
  student,
}: Props) {
  function formatDate(
    date: string
  ) {
    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "Not available";
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  return (
    <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

      <div className="flex flex-col items-center">

        <UserCircle2
          size={70}
          className="text-emerald-600"
        />

        <h2 className="text-xl font-bold mt-3">
          {student.firstName}{" "}
          {student.lastName}
        </h2>

        <p className="text-sm text-slate-500">
          Junior Intern
          {student.batch?.name
            ? ` • ${student.batch.name}`
            : ""}
        </p>

      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">

        <div className="flex items-center gap-2 min-w-0">
          <Mail
            size={16}
            className="text-emerald-600 shrink-0"
          />

          <span className="text-sm truncate">
            {student.email}
          </span>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <Phone
            size={16}
            className="text-emerald-600 shrink-0"
          />

          <span className="text-sm truncate">
            {student.phone ??
              "Not provided"}
          </span>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <IdCard
            size={16}
            className="text-emerald-600 shrink-0"
          />

          <span className="text-sm truncate">
            {student.rollNumber}
          </span>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <Building2
            size={16}
            className="text-emerald-600 shrink-0"
          />

          <span className="text-sm truncate">
            {student.batch?.venue
              ?.name ??
              "Not assigned"}
          </span>
        </div>

      </div>

      {student.batch?.startDate &&
        student.batch?.endDate && (
          <div className="flex items-center gap-2 mt-5">

            <CalendarDays
              size={16}
              className="text-emerald-600 shrink-0"
            />

            <span className="text-sm">
              {formatDate(
                student.batch.startDate
              )}{" "}
              –{" "}
              {formatDate(
                student.batch.endDate
              )}
            </span>

          </div>
        )}

    </section>
  );
}