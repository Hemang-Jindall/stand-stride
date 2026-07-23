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
  FileText,
  ChevronRight,
} from "lucide-react";

export default function StudentDetails() {
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
                Hemang Jindal
              </h2>

              <p className="text-slate-500">
                SNS001
              </p>

            </div>

          </div>

          <div className="space-y-3">

            <div className="flex justify-between">

              <span className="text-slate-500">
                Batch
              </span>

              <span>B2</span>

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
                96%
              </span>

            </div>

          </div>

        </section>

        <section className="mx-5 mt-4 bg-white rounded-xl shadow-sm">

          {[
            {
              title: "Attendance",
              icon: <ClipboardCheck size={18} />,
            },
            {
              title: "Certificates",
              icon: <BadgeCheck size={18} />,
            },
            {
              title: "Leave Requests",
              icon: <CalendarDays size={18} />,
            },
            {
              title: "Grievances",
              icon: <TriangleAlert size={18} />,
            },
            {
              title: "Performance",
              icon: <Users size={18} />,
            },
            {
              title: "Remarks",
              icon: <FileText size={18} />,
            },
          ].map((item) => (

            <button
              key={item.title}
              className="w-full flex justify-between items-center px-5 py-4 border-b last:border-none"
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