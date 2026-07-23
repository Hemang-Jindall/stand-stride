import { useState } from "react";

import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import {
  Settings,
  Moon,
  Bell,
  Shield,
  CircleHelp,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4">

        <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

          <div className="flex items-center gap-2 mb-6">

            <Settings
              size={18}
              className="text-emerald-600"
            />

            <h2 className="text-lg font-semibold">
              Settings
            </h2>

          </div>

          {/* Notifications */}

          <div className="flex items-center justify-between py-3 border-b">

            <div className="flex items-center gap-3">

              <Bell
                size={18}
                className="text-emerald-600"
              />

              <span>Notifications</span>

            </div>

            <button
              onClick={() =>
                setNotificationsEnabled(!notificationsEnabled)
              }
              className={`w-12 h-7 rounded-full transition flex items-center px-1 ${
                notificationsEnabled
                  ? "bg-emerald-600 justify-end"
                  : "bg-slate-300 justify-start"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white" />
            </button>

          </div>

          {/* Dark Mode */}

          <div className="flex items-center justify-between py-3 border-b">

            <div className="flex items-center gap-3">

              <Moon
                size={18}
                className="text-emerald-600"
              />

              <span>Dark Mode</span>

            </div>

            <button
              onClick={() =>
                setDarkMode(!darkMode)
              }
              className={`w-12 h-7 rounded-full transition flex items-center px-1 ${
                darkMode
                  ? "bg-emerald-600 justify-end"
                  : "bg-slate-300 justify-start"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white" />
            </button>

          </div>

          {/* Privacy */}

          <button
            onClick={() => navigate("/privacy")}
            className="w-full flex items-center justify-between py-4 border-b"
          >

            <div className="flex items-center gap-3">

              <Shield
                size={18}
                className="text-emerald-600"
              />

              <span>Privacy</span>

            </div>

            <ChevronRight
              size={18}
              className="text-slate-400"
            />

          </button>

          {/* Help */}

          <button
            onClick={() => navigate("/help")}
            className="w-full flex items-center justify-between py-4 border-b"
          >

            <div className="flex items-center gap-3">

              <CircleHelp
                size={18}
                className="text-emerald-600"
              />

              <span>Help & Support</span>

            </div>

            <ChevronRight
              size={18}
              className="text-slate-400"
            />

          </button>

          {/* Logout */}

          <button
            className="w-full flex items-center justify-between py-4"
          >

            <div className="flex items-center gap-3">

              <LogOut
                size={18}
                className="text-red-500"
              />

              <span>Logout</span>

            </div>

            <ChevronRight
              size={18}
              className="text-slate-400"
            />

          </button>

        </section>

      </main>

      <BottomNavigation />

    </MobileLayout>
  );
}