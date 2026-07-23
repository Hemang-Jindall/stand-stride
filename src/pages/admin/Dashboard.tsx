import { useNavigate } from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import {
  Users,
  ClipboardCheck,
  BadgeCheck,
  TriangleAlert,
} from "lucide-react";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const stats = [
    {
      title: "Active Interns",
      value: "124",
      icon: <Users size={20} className="text-blue-600" />,
      route: "/admin/students",
    },
    {
      title: "Attendance Today",
      value: "118",
      icon: <ClipboardCheck size={20} className="text-emerald-600" />,
      route: "/admin/attendance",
    },
    {
      title: "Certificates Pending",
      value: "12",
      icon: <BadgeCheck size={20} className="text-yellow-600" />,
      route: "/admin/certificates",
    },
    {
      title: "Open Grievances",
      value: "5",
      icon: <TriangleAlert size={20} className="text-red-600" />,
      route: "/admin/grievances",
    },
  ];

  return (

    <MobileLayout>

      <Header />

      <main className="flex-1 py-4">

        <section className="mx-5">

          <h2 className="text-2xl font-bold mb-5">
            Admin Dashboard
          </h2>

          <div className="grid grid-cols-2 gap-4">

            {stats.map((stat) => (

              <button
                key={stat.title}
                onClick={() => navigate(stat.route)}
                className="bg-white rounded-xl shadow-sm p-4 text-left active:scale-95 transition"
              >

                <div className="mb-3">
                  {stat.icon}
                </div>

                <h3 className="text-3xl font-bold">
                  {stat.value}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {stat.title}
                </p>

              </button>

            ))}

          </div>

        </section>

      </main>

      <AdminBottomNavigation />

    </MobileLayout>

  );
}