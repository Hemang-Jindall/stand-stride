import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  TriangleAlert,
  Ellipsis,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

import {
  getAdminRole,
  hasPermission,
} from "../utils/permissions";

import type {
  Permission,
} from "../utils/permissions";

interface NavigationItem {
  title: string;
  route: string;
  icon: React.ReactNode;
  permission?: Permission;
}

export default function AdminBottomNavigation() {
  const adminRole =
    getAdminRole();

  const isMentor =
    adminRole === "MENTOR";

  const linkClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `flex flex-col items-center ${
      isActive
        ? "text-emerald-600"
        : "text-slate-500"
    }`;

  // =========================
  // NAVIGATION
  // =========================

  const items: NavigationItem[] = [
    {
      title: "Dashboard",
      route: "/admin/dashboard",
      icon: (
        <LayoutDashboard
          size={20}
        />
      ),
    },

    {
      title: isMentor
        ? "My Interns"
        : "Students",

      route: "/admin/students",

      icon: (
        <Users
          size={20}
        />
      ),

      permission:
        "VIEW_STUDENTS",
    },

    {
      title: "Attendance",

      route:
        "/admin/attendance",

      icon: (
        <ClipboardCheck
          size={20}
        />
      ),

      permission:
        "VIEW_ATTENDANCE",
    },

    {
      title: "Issues",

      route:
        "/admin/grievances",

      icon: (
        <TriangleAlert
          size={20}
        />
      ),

      permission:
        "VIEW_GRIEVANCES",
    },

    {
      title: "More",

      route: "/admin/more",

      icon: (
        <Ellipsis
          size={20}
        />
      ),
    },
  ];

  // =========================
  // FILTER BY PERMISSIONS
  // =========================

  const visibleItems =
    items.filter(
      (item) =>
        !item.permission ||
        hasPermission(
          item.permission
        )
    );

  // =========================
  // UI
  // =========================

  return (
    <nav className="sticky bottom-0 bg-white border-t border-slate-200">
      <div className="flex justify-around items-center h-14">
        {visibleItems.map(
          (item) => (
            <NavLink
              key={item.route}
              to={item.route}
              className={
                linkClass
              }
            >
              {item.icon}

              <span className="text-[10px] mt-1">
                {item.title}
              </span>
            </NavLink>
          )
        )}
      </div>
    </nav>
  );
}