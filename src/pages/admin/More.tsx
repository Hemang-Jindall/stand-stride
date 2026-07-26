import { useNavigate } from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import {
  Database,
  UserCheck,
  MapPinned,
  BadgeCheck,
  CalendarDays,
  CalendarClock,
  TriangleAlert,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function More() {
  const navigate = useNavigate();

  // =========================
  // Logout
  // =========================

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("student");
    localStorage.removeItem("role");

    navigate("/login", {
      replace: true,
    });
  }

  // =========================
  // Management
  // =========================

  const managementItems = [
    {
      title: "Master Data",
      icon: <Database size={18} />,
      route: "/admin/MasterData",
    },
    {
      title: "Mentor Assignment",
      icon: <UserCheck size={18} />,
      route: "/admin/MentorAssignments",
    },
    {
      title: "Venue Assignment",
      icon: <MapPinned size={18} />,
      route: "/admin/VenueAssignments",
    },
  ];

  // =========================
  // Operations
  // =========================

  const operationItems = [
    {
      title: "Schedule",
      icon: <CalendarClock size={18} />,
      route: "/admin/schedule",
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
  ];

  // =========================
  // Communication
  // =========================

  const communicationItems = [
    {
      title: "Notifications",
      icon: <Bell size={18} />,
      route: "/admin/notifications",
    },
  ];

  // =========================
  // System
  // =========================

  const systemItems = [
    {
      title: "Settings",
      icon: <Settings size={18} />,
      route: "/admin/settings",
    },
  ];

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 overflow-y-auto space-y-5">

        {/* Management */}

        <section className="mx-5">
          <h2 className="text-sm font-semibold text-slate-500 mb-2">
            Management
          </h2>

          <div className="bg-white rounded-xl shadow-sm">
            {managementItems.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => navigate(item.route)}
                className="w-full flex justify-between items-center px-5 py-4 border-b last:border-none hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  {item.icon}

                  <span>
                    {item.title}
                  </span>
                </div>

                <ChevronRight
                  size={18}
                  className="text-slate-400"
                />
              </button>
            ))}
          </div>
        </section>

        {/* Operations */}

        <section className="mx-5">
          <h2 className="text-sm font-semibold text-slate-500 mb-2">
            Operations
          </h2>

          <div className="bg-white rounded-xl shadow-sm">
            {operationItems.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => navigate(item.route)}
                className="w-full flex justify-between items-center px-5 py-4 border-b last:border-none hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  {item.icon}

                  <span>
                    {item.title}
                  </span>
                </div>

                <ChevronRight
                  size={18}
                  className="text-slate-400"
                />
              </button>
            ))}
          </div>
        </section>

        {/* Communication */}

        <section className="mx-5">
          <h2 className="text-sm font-semibold text-slate-500 mb-2">
            Communication
          </h2>

          <div className="bg-white rounded-xl shadow-sm">
            {communicationItems.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => navigate(item.route)}
                className="w-full flex justify-between items-center px-5 py-4 border-b last:border-none hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  {item.icon}

                  <span>
                    {item.title}
                  </span>
                </div>

                <ChevronRight
                  size={18}
                  className="text-slate-400"
                />
              </button>
            ))}
          </div>
        </section>

        {/* System */}

        <section className="mx-5">
          <h2 className="text-sm font-semibold text-slate-500 mb-2">
            System
          </h2>

          <div className="bg-white rounded-xl shadow-sm">
            {systemItems.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => navigate(item.route)}
                className="w-full flex justify-between items-center px-5 py-4 border-b last:border-none hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  {item.icon}

                  <span>
                    {item.title}
                  </span>
                </div>

                <ChevronRight
                  size={18}
                  className="text-slate-400"
                />
              </button>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex justify-between items-center px-5 py-4 text-red-500 hover:bg-red-50 transition"
            >
              <div className="flex items-center gap-3">
                <LogOut size={18} />

                <span>
                  Logout
                </span>
              </div>

              <ChevronRight
                size={18}
                className="text-red-400"
              />
            </button>
          </div>
        </section>

      </main>

      <AdminBottomNavigation />
    </MobileLayout>
  );
}