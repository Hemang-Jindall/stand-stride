import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import { useTheme } from "../../context/ThemeContext";

import {
  Settings,
  Bell,
  Moon,
  Database,
  LogOut,
} from "lucide-react";

export default function AdminSettings() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(true);

  const { darkMode, toggleDarkMode } = useTheme();

  const handleLogout = () => {
    // Future: Clear authentication/session here.
    navigate("/login");
  };

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 overflow-y-auto">
        <section className="mx-5 bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-6">
            <Settings
              size={22}
              className="text-emerald-600"
            />

            <h1 className="text-xl font-bold">
              Admin Settings
            </h1>
          </div>

          {/* Notifications */}

          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex items-center gap-3">
              <Bell
                size={18}
                className="text-emerald-600"
              />

              Notifications
            </div>

            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-7 rounded-full flex items-center px-1 transition ${
                notifications
                  ? "bg-emerald-600 justify-end"
                  : "bg-slate-300 justify-start"
              }`}
            >
              <div className="w-5 h-5 bg-white rounded-full" />
            </button>
          </div>

          {/* Dark Mode */}

          <div className="flex justify-between items-center py-4 border-b">
            <div className="flex items-center gap-3">
              <Moon
                size={18}
                className="text-emerald-600"
              />

              Dark Mode
            </div>

            <button
              onClick={toggleDarkMode}
              className={`w-12 h-7 rounded-full flex items-center px-1 transition ${
                darkMode
                  ? "bg-emerald-600 justify-end"
                  : "bg-slate-300 justify-start"
              }`}
            >
              <div className="w-5 h-5 bg-white rounded-full" />
            </button>
          </div>

          {/* Backup */}

          <button className="w-full flex justify-between items-center py-4 border-b">
            <div className="flex items-center gap-3">
              <Database
                size={18}
                className="text-emerald-600"
              />

              Backup Data
            </div>
          </button>

          {/* Logout */}

          <button
            onClick={handleLogout}
            className="w-full flex justify-between items-center py-4"
          >
            <div className="flex items-center gap-3">
              <LogOut
                size={18}
                className="text-red-500"
              />

              Logout
            </div>
          </button>
        </section>
      </main>

      <AdminBottomNavigation />
    </MobileLayout>
  );
}