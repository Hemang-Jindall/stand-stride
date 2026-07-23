import { FilePlus2 } from "lucide-react";

export default function LeaveRequestCard() {
  return (
    <section className="mx-5 bg-white rounded-2xl shadow-sm p-5">

      <div className="flex items-center gap-2 mb-3">
        <FilePlus2
          size={18}
          className="text-emerald-600"
        />

        <h2 className="font-semibold text-slate-800">
          Leave Request
        </h2>
      </div>

      <p className="text-sm text-slate-500 mb-5">
        Need to take a leave? Submit your request for mentor approval.
      </p>

      <button
        className="w-full rounded-xl bg-emerald-600 text-white py-3 font-medium hover:bg-emerald-700 transition"
      >
        Request Leave
      </button>

    </section>
  );
}