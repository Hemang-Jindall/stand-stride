import {
  UserRound,
  Mail,
  Phone,
} from "lucide-react";

export default function MentorCard() {
  return (
    <section className="mx-5 bg-white rounded-2xl shadow-sm p-5">

      <h2 className="font-semibold text-slate-800 mb-5">
        Mentor Information
      </h2>

      <div className="space-y-4">

        <div className="flex items-center gap-3">
          <UserRound
            size={18}
            className="text-emerald-600"
          />

          <div>
            <p className="text-xs text-slate-500">
              Mentor
            </p>

            <p className="font-medium">
              Rashmi Sharma
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
              rashmi@standstride.org
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
              Contact
            </p>

            <p className="font-medium">
              +91 98765 12345
            </p>
          </div>
        </div>

      </div>

    </section>
  );
}