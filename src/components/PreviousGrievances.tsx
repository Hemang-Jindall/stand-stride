import {
  Clock3,
  CircleCheck,
} from "lucide-react";

export default function PreviousGrievances() {
  const grievances = [
    {
      title: "Projector not working",
      date: "10 Jul 2026",
      status: "Resolved",
      resolved: true,
    },
    {
      title: "Mentor unavailable",
      date: "05 Jul 2026",
      status: "In Review",
      resolved: false,
    },
  ];

  return (
    <section className="mx-5 bg-white rounded-2xl shadow-sm p-5">

      <h2 className="font-semibold text-slate-800 mb-5">
        Previous Grievances
      </h2>

      <div className="space-y-4">

        {grievances.map((grievance) => (
          <div
            key={grievance.title}
            className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-none last:pb-0"
          >

            <div>
              <p className="font-medium">
                {grievance.title}
              </p>

              <p className="text-sm text-slate-500">
                {grievance.date}
              </p>
            </div>

            <div className="flex items-center gap-2">

              {grievance.resolved ? (
                <CircleCheck
                  size={18}
                  className="text-emerald-600"
                />
              ) : (
                <Clock3
                  size={18}
                  className="text-yellow-500"
                />
              )}

              <span className="text-sm">
                {grievance.status}
              </span>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}