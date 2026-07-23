import { BadgeCheck } from "lucide-react";

export default function CertificateStatusCard() {
  return (
    <section className="mx-5 bg-white rounded-2xl shadow-sm p-5">

      <div className="flex items-center gap-2 mb-5">

        <BadgeCheck
          size={20}
          className="text-emerald-600"
        />

        <h2 className="font-semibold text-slate-800">
          Certificate Status
        </h2>

      </div>

      <div className="text-center">

        <h1 className="text-5xl font-bold text-yellow-500">
          Pending
        </h1>

        <p className="text-slate-500 mt-3">
          Complete all internship requirements to unlock your certificate.
        </p>

      </div>

    </section>
  );
}