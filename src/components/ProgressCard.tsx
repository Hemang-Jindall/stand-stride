import { Trophy } from "lucide-react";

export default function ProgressCard() {
  return (
    <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

      <div className="flex items-center gap-2 mb-3">
        <Trophy
          size={18}
          className="text-emerald-600"
        />

        <h3 className="text-lg font-semibold text-slate-800">
          Internship Progress
        </h3>
      </div>

      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-slate-500">
          Overall Progress
        </span>

        <span className="font-semibold text-emerald-600">
          57%
        </span>
      </div>

      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-600 rounded-full"
          style={{ width: "57%" }}
        />
      </div>

      <p className="text-sm text-slate-500 mt-3">
        Step <strong>4</strong> of <strong>7</strong> completed
      </p>

    </section>
  );
}