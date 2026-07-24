import { useLocation, useNavigate } from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import {
  User,
  Users,
  ClipboardCheck,
  BadgeCheck,
  TriangleAlert,
  CalendarDays,
  ChevronRight,
} from "lucide-react";

export default function StudentDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const student = location.state?.student || {
    id: "SNS001",
    name: "Hemang Jindal",
    batch: "B2",
    attendance: "96%",
    status: "Active",
    active: true,
  };

  const menuItems = [
    {
      title: "Attendance",
      icon: <ClipboardCheck size={18} />,
      route: "/admin/attendance",
    },
    {
      title: "Certificates",
      icon: <BadgeCheck size={18} />,
      route: "/admin/certificates",
    },
    {
      title: "Leave Requests",
      icon: <CalendarDays size={18} />,
      route: "/admin/leave-requests",
    },
    {
      title: "Grievances",
      icon: <TriangleAlert size={18} />,
      route: "/admin/grievances",
    },
    {
      title: "Internship Progress",
      icon: <Users size={18} />,
      route: "/admin/performance",
    },
  ];

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 overflow-y-auto">
        <section className="mx-5 bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3 mb-5">
            <User
              size={48}
              className="text-emerald-600"
            />

            <div>
              <h2 className="text-xl font-bold">
                {student.name}
              </h2>

              <p className="text-slate-500">
                {student.id}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">
                Batch
              </span>

              <span>{student.batch}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Mentor
              </span>

              <span>Rashmi Ma'am</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Attendance
              </span>

              <span className="text-emerald-600 font-semibold">
                {student.attendance}
              </span>
            </div>
          </div>
        </section>

        <section className="mx-5 mt-4 bg-white rounded-xl shadow-sm">
          {menuItems.map((item) => (
            <button
              key={item.title}
              onClick={() =>
                navigate(item.route, {
                  state: { student },
                })
              }
              className="w-full flex justify-between items-center px-5 py-4 border-b last:border-none hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-3">
                {item.icon}

                <span>{item.title}</span>
              </div>

              <ChevronRight
                size={18}
                className="text-slate-400"
              />
            </button>
          ))}
        </section>
      </main>

      <AdminBottomNavigation />
    </MobileLayout>
  );
}