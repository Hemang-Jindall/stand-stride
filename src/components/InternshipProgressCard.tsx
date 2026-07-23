import {
  Trophy,
  CheckCircle,
  Clock3,
  Lock,
} from "lucide-react";

export default function InternshipProgressCard() {
  return (
    <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

      <div className="flex items-center gap-2 mb-4">

        <Trophy
          size={18}
          className="text-emerald-600"
        />

        <h2 className="text-lg font-semibold">
          Internship Progress
        </h2>

      </div>

      <div className="flex justify-between items-center mb-2">

        <span className="text-sm text-slate-500">
          Overall Progress
        </span>

        <span className="font-bold text-emerald-600">
          57%
        </span>

      </div>

      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-4">

        <div
          className="h-full bg-emerald-600"
          style={{ width: "57%" }}
        />

      </div>

      <div className="space-y-2">

        <div className="flex items-center gap-2">
          <CheckCircle
            size={16}
            className="text-green-600"
          />

          <span className="text-sm">
            Registration Completed
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle
            size={16}
            className="text-green-600"
          />

          <span className="text-sm">
            Offer Letter Received
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle
            size={16}
            className="text-green-600"
          />

          <span className="text-sm">
            Batch Allocated
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock3
            size={16}
            className="text-yellow-500"
          />

          <span className="text-sm">
            Attendance In Progress
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Lock
            size={16}
            className="text-slate-400"
          />

          <span className="text-sm">
            Certificate Locked
          </span>
        </div>

      </div>

    </section>
  );
}