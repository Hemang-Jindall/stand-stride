import {
  Mail,
  Phone,
  IdCard,
  GraduationCap,
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
  };
}

export default function PersonalInformationCard() {
  let student: StoredStudent | null = null;

  try {
    const stored =
      localStorage.getItem("student");

    if (stored) {
      student = JSON.parse(stored);
    }
  } catch (error) {
    console.error(
      "LOAD PERSONAL INFORMATION ERROR:",
      error
    );
  }

  if (!student) {
    return (
      <section className="mx-5 bg-white rounded-xl shadow-sm p-6 text-center text-slate-500">
        Personal information unavailable.
      </section>
    );
  }

  return (
    <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

      <h2 className="text-lg font-semibold mb-5">
        Personal Information
      </h2>

      <div className="space-y-5">

        <div className="flex items-center gap-3">

          <IdCard
            size={18}
            className="text-emerald-600"
          />

          <div>
            <p className="text-xs text-slate-500">
              Student ID
            </p>

            <p className="font-medium">
              {student.rollNumber}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <Mail
            size={18}
            className="text-emerald-600"
          />

          <div className="min-w-0">
            <p className="text-xs text-slate-500">
              Email
            </p>

            <p className="font-medium break-all">
              {student.email}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <Phone
            size={18}
            className="text-emerald-600"
          />

          <div>
            <p className="text-xs text-slate-500">
              Phone
            </p>

            <p className="font-medium">
              {student.phone ??
                "Not provided"}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <GraduationCap
            size={18}
            className="text-emerald-600"
          />

          <div>
            <p className="text-xs text-slate-500">
              Batch
            </p>

            <p className="font-medium">
              {student.batch?.name ??
                "Not assigned"}
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}