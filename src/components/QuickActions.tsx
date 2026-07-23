import { FileText, TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

      <div className="mb-3">
        <h3 className="text-lg font-semibold text-slate-800">
          Quick Actions
        </h3>

        <p className="text-sm text-slate-500">
          Frequently used shortcuts
        </p>
      </div>

      <div className="space-y-2">

        <button
          onClick={() => navigate("/grievance")}
          className="w-full rounded-xl bg-red-500 text-white py-2.5 font-medium flex items-center justify-center gap-2 transition hover:bg-red-600"
        >
          <TriangleAlert size={18} />
          Raise Grievance
        </button>

        <button
          onClick={() => navigate("/certificate")}
          className="w-full rounded-xl bg-emerald-600 text-white py-2.5 font-medium flex items-center justify-center gap-2 transition hover:bg-emerald-700"
        >
          <FileText size={18} />
          Request Certificate
        </button>

      </div>

    </section>
  );
}