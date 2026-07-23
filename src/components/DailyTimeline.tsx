import { CheckCircle2, Clock3 } from "lucide-react";

export default function DailyTimeline() {
  const timeline = [
    {
      time: "09:30 AM",
      activity: "Reporting",
      completed: true,
    },
    {
      time: "10:00 AM",
      activity: "Career Guidance",
      completed: true,
    },
    {
      time: "12:00 PM",
      activity: "Lunch Break",
      completed: false,
    },
    {
      time: "01:00 PM",
      activity: "Group Activity",
      completed: false,
    },
    {
      time: "03:00 PM",
      activity: "Feedback Session",
      completed: false,
    },
  ];

  return (
    <section className="mx-5 bg-white rounded-2xl shadow-sm p-5">

      <h2 className="font-semibold text-slate-800 mb-5">
        Today's Timeline
      </h2>

      <div className="space-y-5">

        {timeline.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4"
          >
            <div className="mt-1">
              {item.completed ? (
                <CheckCircle2
                  size={20}
                  className="text-emerald-600"
                />
              ) : (
                <Clock3
                  size={20}
                  className="text-slate-400"
                />
              )}
            </div>

            <div>
              <p className="text-sm text-slate-500">
                {item.time}
              </p>

              <p className="font-medium text-slate-800">
                {item.activity}
              </p>
            </div>
          </div>
        ))}

      </div>

    </section>
  );
}