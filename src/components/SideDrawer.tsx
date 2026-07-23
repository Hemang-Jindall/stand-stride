import {
  X,
  House,
  CalendarDays,
  ClipboardCheck,
  User,
  BadgeCheck,
  TriangleAlert,
  Bell,
  Settings,
} from "lucide-react";

import { Link } from "react-router-dom";

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function SideDrawer({
  open,
  onClose,
}: SideDrawerProps) {
  return (
    <>
      {/* Backdrop */}

      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 transition-opacity z-40 ${
          open
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b">

          <h2 className="font-bold text-lg">
            Menu
          </h2>

          <button onClick={onClose}>
            <X size={22} />
          </button>

        </div>

        <nav className="flex flex-col p-3">

          <DrawerItem
            to="/"
            icon={<House size={18} />}
            label="Dashboard"
            onClose={onClose}
          />

          <DrawerItem
            to="/schedule"
            icon={<CalendarDays size={18} />}
            label="Schedule"
            onClose={onClose}
          />

          <DrawerItem
            to="/attendance"
            icon={<ClipboardCheck size={18} />}
            label="Attendance"
            onClose={onClose}
          />

          <DrawerItem
            to="/profile"
            icon={<User size={18} />}
            label="Profile"
            onClose={onClose}
          />

          <DrawerItem
            to="/certificate"
            icon={<BadgeCheck size={18} />}
            label="Certificate"
            onClose={onClose}
          />

          <DrawerItem
            to="/grievance"
            icon={<TriangleAlert size={18} />}
            label="Grievance"
            onClose={onClose}
          />

          <DrawerItem
            to="/notifications"
            icon={<Bell size={18} />}
            label="Notifications"
            onClose={onClose}
          />

          <DrawerItem
            to="/settings"
            icon={<Settings size={18} />}
            label="Settings"
            onClose={onClose}
          />

        </nav>

      </aside>
    </>
  );
}

function DrawerItem({
  to,
  icon,
  label,
  onClose,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClose: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100"
    >
      {icon}

      <span>{label}</span>
    </Link>
  );
}