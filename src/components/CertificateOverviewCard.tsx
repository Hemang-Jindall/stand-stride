import {
  BadgeCheck,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function CertificateOverviewCard() {
  const requirements = [
    {
      title: "Complete Internship",
      completed: true,
    },
    {
      title: "90% Attendance",
      completed: true,
    },
    {
      title: "Submit Final Report",
      completed: false,
    },
    {
      title: "Mentor Approval",
      completed: false,
    },
  ];

  return (
    <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

      <div className="flex items-center gap-2 mb-4">

        <BadgeCheck
          size={18}
          className="text-emerald-600"
        />

        <h2 className="text-lg font-semibold">
          Certificate
        </h2>

      </div>

      <div className="flex items-center justify-between mb-5">

        <div>

          <p className="text-3xl font-bold text-yellow-500">
            Pending
          </p>

          <p className="text-sm text-slate-500">
            Certificate Status
          </p>

        </div>

      </div>

      <div className="space-y-2">

        {requirements.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-2"
          >
            {item.completed ? (
              <CheckCircle2
                size={16}
                className="text-emerald-600"
              />
            ) : (
              <Lock
                size={16}
                className="text-slate-400"
              />
            )}

            <span className="text-sm">
              {item.title}
            </span>

          </div>
        ))}

      </div>

    </section>
  );
}