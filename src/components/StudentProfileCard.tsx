import {
  UserCircle2,
  Mail,
  Phone,
  IdCard,
  Building2,
  CalendarDays,
} from "lucide-react";

export default function StudentProfileCard() {
  return (
    <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

      <div className="flex flex-col items-center">

        <UserCircle2
          size={70}
          className="text-emerald-600"
        />

        <h2 className="text-xl font-bold mt-3">
          Hemang
        </h2>

        <p className="text-sm text-slate-500">
          Junior Intern • Batch B2
        </p>

      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">

        <div className="flex items-center gap-2">
          <Mail size={16} className="text-emerald-600" />
          <span className="text-sm">hemang@example.com</span>
        </div>

        <div className="flex items-center gap-2">
          <Phone size={16} className="text-emerald-600" />
          <span className="text-sm">+91 98765 43210</span>
        </div>

        <div className="flex items-center gap-2">
          <IdCard size={16} className="text-emerald-600" />
          <span className="text-sm">SNU2026001</span>
        </div>

        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-emerald-600" />
          <span className="text-sm">Stand & Stride</span>
        </div>

      </div>

      <div className="flex items-center gap-2 mt-5">

        <CalendarDays
          size={16}
          className="text-emerald-600"
        />

        <span className="text-sm">
          1 Jun 2026 – 31 Jul 2026
        </span>

      </div>

    </section>
  );
}