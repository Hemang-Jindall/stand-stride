import {
  House,
  CalendarDays,
  ClipboardCheck,
  User,
  Ellipsis,
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function BottomNavigation() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center transition-colors ${
      isActive
        ? "text-emerald-600"
        : "text-slate-500 hover:text-emerald-500"
    }`;

  return (
    <nav className="sticky bottom-0 bg-white border-t border-slate-200">

      <div className="flex justify-around items-center h-14">

        <NavLink
          to="/"
          className={linkClass}
        >
          <House size={20} />
          <span className="text-[10px] mt-1">
            Home
          </span>
        </NavLink>

        <NavLink
          to="/schedule"
          className={linkClass}
        >
          <CalendarDays size={20} />
          <span className="text-[10px] mt-1">
            Schedule
          </span>
        </NavLink>

        <NavLink
          to="/attendance"
          className={linkClass}
        >
          <ClipboardCheck size={20} />
          <span className="text-[10px] mt-1">
            Attendance
          </span>
        </NavLink>

        <NavLink
          to="/profile"
          className={linkClass}
        >
          <User size={20} />
          <span className="text-[10px] mt-1">
            Profile
          </span>
        </NavLink>

        <NavLink
          to="/more"
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