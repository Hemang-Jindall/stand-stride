import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import {
  Bell,
  CalendarDays,
  ClipboardCheck,
  BadgeCheck,
  TriangleAlert,
} from "lucide-react";

const notifications = [
  {
    icon: <CalendarDays size={18} className="text-blue-500" />,
    title: "NGO Visit Tomorrow",
    description: "Report at the main gate by 9:30 AM.",
  },
  {
    icon: <ClipboardCheck size={18} className="text-emerald-600" />,
    title: "Attendance Updated",
    description: "Your attendance has been marked for today.",
  },
  {
    icon: <BadgeCheck size={18} className="text-yellow-500" />,
    title: "Certificate Pending",
    description: "Complete the remaining requirements.",
  },
  {
    icon: <TriangleAlert size={18} className="text-red-500" />,
    title: "Grievance Resolved",
    description: "Projector issue has been marked as resolved.",
  },
];

export default function Notifications() {
  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 space-y-4 overflow-y-auto">

        <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

          <div className="flex items-center gap-2 mb-4">

            <Bell
              size={18}
              className="text-emerald-600"
            />

            <h2 className="text-lg font-semibold">
              Notifications
            </h2>

          </div>

          <div className="space-y-4">

            {notifications.map((item) => (
              <div
                key={item.title}
                className="flex gap-3 border-b border-slate-100 pb-4 last:border-none last:pb-0"
              >
                <div className="mt-1">
                  {item.icon}
                </div>

                <div>
                  <p className="font-medium">
                    {item.title}
                  </p>

                  <p className="text-sm text-slate-500">
                    {item.description}
                  </p>
                </div>

              </div>
            ))}

          </div>

        </section>

      </main>

      <BottomNavigation />
    </MobileLayout>
  );
}