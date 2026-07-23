import {
  Phone,
  Mail,
  ShieldAlert,
} from "lucide-react";

export default function EmergencyContactCard() {
  return (
    <section className="mx-5 bg-white rounded-2xl shadow-sm p-5">

      <div className="flex items-center gap-2 mb-5">

        <ShieldAlert
          size={20}
          className="text-red-500"
        />

        <h2 className="font-semibold text-slate-800">
          Emergency Contact
        </h2>

      </div>

      <div className="space-y-4">

        <div className="flex items-center gap-3">
          <Phone
            size={18}
            className="text-emerald-600"
          />

          <div>
            <p className="text-xs text-slate-500">
              Helpline
            </p>

            <p className="font-medium">
              +91 1800-123-4567
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
              support@standstride.org
            </p>
          </div>
        </div>

      </div>

    </section>
  );
}