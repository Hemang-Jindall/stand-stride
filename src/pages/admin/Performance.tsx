import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import {
  TrendingUp,
  Star,
} from "lucide-react";

export default function Performance() {

  const metrics = [
    {
      title: "Attendance",
      value: "96%",
    },
    {
      title: "Tasks Completed",
      value: "18 / 20",
    },
    {
      title: "Average Rating",
      value: "4.8 / 5",
    },
    {
      title: "Overall Progress",
      value: "92%",
    },
  ];

  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        <section className="mx-5">

          <div className="flex items-center gap-2 mb-5">

            <TrendingUp
              size={22}
              className="text-emerald-600"
            />

            <h1 className="text-2xl font-bold">
              Performance
            </h1>

          </div>

          <div className="space-y-3">

            {metrics.map((metric) => (

              <div
                key={metric.title}
                className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center"
              >

                <span className="font-medium">
                  {metric.title}
                </span>

                <span className="font-bold text-emerald-600">
                  {metric.value}
                </span>

              </div>

            ))}

          </div>

          <div className="mt-5 bg-white rounded-xl shadow-sm p-4">

            <div className="flex items-center gap-2 mb-3">

              <Star
                size={20}
                className="text-yellow-500"
              />

              <h2 className="font-semibold">
                Mentor Feedback
              </h2>

            </div>

            <p className="text-slate-600">
              Excellent participation throughout the internship.
              Consistently completes assigned work on time and
              actively contributes during discussions.
            </p>

          </div>

        </section>

      </main>

      <AdminBottomNavigation />

    </MobileLayout>
  );
}