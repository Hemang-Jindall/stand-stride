import {
  UserCircle2,
  Mail,
  Phone,
  IdCard,
  Building2,
  CalendarDays,
} from "lucide-react";

interface StoredStudent {
  id: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;

  batch?: {
    id: string;
    name: string;
    startDate?: string;
    endDate?: string;
    venue?: {
      id: string;
      name: string;
    };
  };
}

export default function StudentProfileCard() {
  let student: StoredStudent | null = null;

  try {
    const stored =
      localStorage.getItem("student");

    if (stored) {
      student = JSON.parse(stored);
    }
  } catch (error) {
    console.error(
      "LOAD STUDENT PROFILE ERROR:",
      error
    );
  }

  if (!student) {
    return (
      <section className="mx-5 bg-white rounded-xl shadow-sm p-6 text-center text-slate-500">
        Student information unavailable.
      </section>
    );
  }

  function formatDate(
    date?: string
  ) {
    if (!date) {
      return null;
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  const startDate =
    formatDate(
      student.batch?.startDate
    );

  const endDate =
    formatDate(
      student.batch?.endDate
    );

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
              "Stand & Stride"}
          </span>

        </div>

      </div>

      {startDate && endDate && (
        <div className="flex items-center gap-2 mt-5">

          <CalendarDays
            size={16}
            className="text-emerald-600"
          />

          <span className="text-sm">
            {startDate} – {endDate}
          </span>

        </div>
      )}

    </section>
  );
}