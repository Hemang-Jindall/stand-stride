import {
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function RequirementsCard() {
  const requirements = [
    {
      title: "Complete Internship",
      completed: true,
    },
    {
      title: "Minimum 90% Attendance",
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
    <section className="mx-5 bg-white rounded-2xl shadow-sm p-5">

      <h2 className="font-semibold text-slate-800 mb-5">
        Certificate Requirements
      </h2>

      <div className="space-y-4">

        {requirements.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-3"
          >

            {item.completed ? (
              <CheckCircle2
                size={20}
                className="text-emerald-600"
              />
            ) : (
              <Lock
                size={20}
                className="text-slate-400"
              />
            )}

            <span className="font-medium">
              {item.title}
            </span>

          </div>
        ))}

      </div>

    </section>
  );
}