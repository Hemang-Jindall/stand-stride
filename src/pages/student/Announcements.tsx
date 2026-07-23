import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import { Megaphone } from "lucide-react";

const announcements = [
  {
    title: "NGO Visit Tomorrow",
    description: "Report by 9:30 AM at the main gate.",
    date: "15 Jul 2026",
  },
  {
    title: "Bring Your ID Card",
    description: "ID verification will be done before attendance.",
    date: "14 Jul 2026",
  },
  {
    title: "Resume Workshop",
    description: "Resume review session on Friday at 11:00 AM.",
    date: "12 Jul 2026",
  },
  {
    title: "Internship Guidelines Updated",
    description: "Please review the latest internship handbook.",
    date: "10 Jul 2026",
  },
];

export default function Announcements() {
  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4">

        <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

          <div className="flex items-center gap-2 mb-5">

            <Megaphone
              size={18}
              className="text-emerald-600"
            />

            <h2 className="text-lg font-semibold">
              Announcements
            </h2>

          </div>

          <div className="space-y-4">

            {announcements.map((item) => (
              <div
                key={item.title}
                className="border-l-4 border-emerald-500 pl-3 pb-4 border-b border-slate-100 last:border-b-0"
              >
                <p className="font-semibold">
                  {item.title}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  {item.description}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  {item.date}
                </p>
              </div>
            ))}

          </div>

        </section>

      </main>

      <BottomNavigation />
    </MobileLayout>
  );
}