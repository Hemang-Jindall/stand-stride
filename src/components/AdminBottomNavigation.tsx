import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  TriangleAlert,
  Ellipsis,
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function AdminBottomNavigation() {

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center ${
      isActive
        ? "text-emerald-600"
        : "text-slate-500"
    }`;

  return (
    <nav className="sticky bottom-0 bg-white border-t border-slate-200">

      <div className="flex justify-around items-center h-14">

        <NavLink
          to="/admin/dashboard"
          className={linkClass}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] mt-1">
            Dashboard
          </span>
        </NavLink>

        <NavLink
          to="/admin/students"
          className={linkClass}
        >
          <Users size={20} />
          <span className="text-[10px] mt-1">
            Students
          </span>
        </NavLink>

        <NavLink
          to="/admin/attendance"
          className={linkClass}
        >
          <ClipboardCheck size={20} />
          <span className="text-[10px] mt-1">
            Attendance
          </span>
        </NavLink>

        <NavLink
          to="/admin/grievances"
          className={linkClass}
        >
          <TriangleAlert size={20} />
          <span className="text-[10px] mt-1">
            Issues
          </span>
        </NavLink>

        <NavLink
          to="/admin/more"
          className={linkClass}
        >
          <Ellipsis size={20} />
          <span className="text-[10px] mt-1">
            More
          </span>
        </NavLink>

      </div>

    </nav>
  );
}