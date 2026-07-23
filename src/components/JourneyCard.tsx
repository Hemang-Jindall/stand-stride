import {
  CheckCircle,
  Clock3,
  Lock,
} from "lucide-react";

export default function JourneyCard() {
  return (
    <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

      <h2 className="text-lg font-semibold mb-3">
        Internship Journey
      </h2>

      <div className="space-y-3">

        <div className="flex items-center gap-2">
          <CheckCircle
            size={18}
            className="text-green-600"
          />
          <span className="text-sm">
            Registration Completed
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle
            size={18}
            className="text-green-600"
          />
          <span className="text-sm">
            Offer Letter Received
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle
            size={18}
            className="text-green-600"
          />
          <span className="text-sm">
            Batch Allocated
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock3
            size={18}
            className="text-yellow-500"
          />
          <span className="text-sm">
            Attendance In Progress
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Lock
            size={18}
            className="text-gray-400"
          />
          <span className="text-sm">
            Certificate Locked
          </span>
        </div>

      </div>

    </section>
  );
}