import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import {
  getAdminRole,
  hasPermission,
} from "../../utils/permissions";

import type {
  Permission,
} from "../../utils/permissions";

import {
  Database,
  UserCheck,
  Users,
  MapPinned,
  BadgeCheck,
  CalendarDays,
  CalendarClock,
  TriangleAlert,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";

// =========================
// Types
// =========================

interface MenuItem {
  title: string;
  icon: ReactNode;
  route: string;
  permission?: Permission;

  // Optional role restriction
  roles?: (
    | "FACILITATOR"
    | "COORDINATOR"
    | "MENTOR"
    | "ADMIN"
  )[];
}

// =========================
// Component
// =========================

export default function More() {
  const navigate =
    useNavigate();

  const adminRole =
    getAdminRole();

  const isMentor =
    adminRole === "MENTOR";

  // =========================
  // Logout
  // =========================

  function handleLogout() {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "admin"
    );

    localStorage.removeItem(
      "student"
    );

    localStorage.removeItem(
      "role"
    );

    localStorage.removeItem(
      "adminRole"
    );

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  }

  // =========================
  // Management
  // =========================

  const managementItems: MenuItem[] = [
    {
      title: isMentor
        ? "My Interns"
        : "Students",

      icon: (
        <Users size={18} />
      ),

      route:
        "/admin/students",

      permission:
        "VIEW_STUDENTS",
    },

    {
      title: "Master Data",

      icon: (
        <Database size={18} />
      ),

      route:
        "/admin/MasterData",

      permission:
        "VIEW_MASTER_DATA",
    },

    {
      title:
        "Mentor Assignment",

      icon: (
        <UserCheck size={18} />
      ),

      route:
        "/admin/MentorAssignments",

      permission:
        "VIEW_MENTORS",

      roles: [
        "FACILITATOR",
        "COORDINATOR",
        "ADMIN",
      ],
    },

    {
      title:
        "Venue Assignment",

      icon: (
        <MapPinned size={18} />
      ),

      route:
        "/admin/VenueAssignments",

      permission:
        "VIEW_VENUES",

      roles: [
        "FACILITATOR",
        "COORDINATOR",
        "ADMIN",
      ],
    },
  ];

  // =========================
  // Operations
  // =========================

  const operationItems: MenuItem[] = [
    {
      title: "Schedule",

      icon: (
        <CalendarClock
          size={18}
        />
      ),

      route:
        "/admin/schedule",

      permission:
        "VIEW_SCHEDULE",
    },

    {
      title: "Performance",

      icon: (
        <ChartNoAxesColumnIncreasing
          size={18}
        />
      ),

      route:
        "/admin/performance",

      permission:
        "VIEW_PERFORMANCE",
    },

    {
      title: "Certificates",

      icon: (
        <BadgeCheck
          size={18}
        />
      ),

      route:
        "/admin/certificates",

      permission:
        "VIEW_CERTIFICATES",
    },

    {
      title:
        "Leave Requests",

      icon: (
        <CalendarDays
          size={18}
        />
      ),

      route:
        "/admin/leave-requests",

      permission:
        "VIEW_LEAVE",
    },

    {
      title: "Grievances",

      icon: (
        <TriangleAlert
          size={18}
        />
      ),

      route:
        "/admin/grievances",

      permission:
        "VIEW_GRIEVANCES",
    },
  ];

  // =========================
  // Communication
  // =========================

  const communicationItems: MenuItem[] = [
    {
      title:
        "Notifications",

      icon: (
        <Bell size={18} />
      ),

      route:
        "/admin/notifications",

      permission:
        "VIEW_NOTIFICATIONS",
    },
  ];

  // =========================
  // System
  // =========================

  const systemItems: MenuItem[] = [
    {
      title: "Settings",

      icon: (
        <Settings size={18} />
      ),

      route:
        "/admin/settings",

      // Settings stays available
      // to every staff account.
    },
  ];

  // =========================
  // Filter
  // =========================

  function filterItems(
    items: MenuItem[]
  ): MenuItem[] {
    return items.filter(
      (item) => {
        // Check staff role
        if (
          item.roles &&
          (
            !adminRole ||
            !item.roles.includes(
              adminRole
            )
          )
        ) {
          return false;
        }

        // Check permission
        if (
          item.permission &&
          !hasPermission(
            item.permission
          )
        ) {
          return false;
        }

        return true;
      }
    );
  }

  const visibleManagementItems =
    filterItems(
      managementItems
    );

  const visibleOperationItems =
    filterItems(
      operationItems
    );

  const visibleCommunicationItems =
    filterItems(
      communicationItems
    );

  const visibleSystemItems =
    filterItems(
      systemItems
    );

  // =========================
  // Render Menu Items
  // =========================

  function renderMenuItems(
    items: MenuItem[]
  ) {
    return items.map(
      (item) => (
        <button
          key={item.route}
          type="button"
          onClick={() =>
            navigate(
              item.route
            )
          }
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
      )
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 overflow-y-auto space-y-5">

        {/* Management */}

        {visibleManagementItems.length >
          0 && (
          <section className="mx-5">
            <h2 className="text-sm font-semibold text-slate-500 mb-2">
              {isMentor
                ? "Interns"
                : "Management"}
            </h2>

            <div className="bg-white rounded-xl shadow-sm">
              {renderMenuItems(
                visibleManagementItems
              )}
            </div>
          </section>
        )}

        {/* Operations */}

        {visibleOperationItems.length >
          0 && (
          <section className="mx-5">
            <h2 className="text-sm font-semibold text-slate-500 mb-2">
              Operations
            </h2>

            <div className="bg-white rounded-xl shadow-sm">
              {renderMenuItems(
                visibleOperationItems
              )}
            </div>
          </section>
        )}

        {/* Communication */}

        {visibleCommunicationItems.length >
          0 && (
          <section className="mx-5">
            <h2 className="text-sm font-semibold text-slate-500 mb-2">
              Communication
            </h2>

            <div className="bg-white rounded-xl shadow-sm">
              {renderMenuItems(
                visibleCommunicationItems
              )}
            </div>
          </section>
        )}

        {/* System */}

        <section className="mx-5">
          <h2 className="text-sm font-semibold text-slate-500 mb-2">
            System
          </h2>

          <div className="bg-white rounded-xl shadow-sm">
            {renderMenuItems(
              visibleSystemItems
            )}

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="w-full flex justify-between items-center px-5 py-4 text-red-500 hover:bg-red-50 transition"
            >
              <div className="flex items-center gap-3">
                <LogOut
                  size={18}
                />

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