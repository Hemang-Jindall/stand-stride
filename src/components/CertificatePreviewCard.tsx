import { FileBadge } from "lucide-react";

export default function CertificatePreviewCard() {
  return (
    <section className="mx-5 bg-white rounded-2xl shadow-sm p-5">

      <div className="flex items-center gap-2 mb-5">

        <FileBadge
          size={20}
          className="text-emerald-600"
        />

        <h2 className="font-semibold text-slate-800">
          Certificate Preview
        </h2>

      </div>

      <div className="border-2 border-dashed border-slate-300 rounded-xl h-56 flex flex-col items-center justify-center">

        <FileBadge
          size={60}
          className="text-slate-400 mb-4"
        />

        <p className="font-medium text-slate-600">
          Certificate Preview
        </p>

        <p className="text-sm text-slate-500 mt-2">
          Available after internship completion
        </p>

      </div>

    </section>
  );
}