import {
  Mail,
  Phone,
  IdCard,
  GraduationCap,
} from "lucide-react";

export default function PersonalInformationCard() {
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
              SNS2026001
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <Mail
            size={18}
            className="text-emerald-600"
          />

          <div>

            <p className="text-xs text-slate-500">
              Email
            </p>

            <p className="font-medium">
              student@snu.edu.in
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
              +91 98765 43210
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
              Department
            </p>

            <p className="font-medium">
              Computer Science
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}