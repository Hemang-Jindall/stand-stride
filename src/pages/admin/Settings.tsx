import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import { useTheme } from "../../context/ThemeContext";

import api from "../../api/api";

import {
  Settings,
  Bell,
  Moon,
  Database,
  LogOut,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminSettings() {
  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState(true);

  const { darkMode, toggleDarkMode } =
    useTheme();

  // =========================
  // Password State
  // =========================

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPasswords,
    setShowPasswords,
  ] = useState(false);

  const [
    changingPassword,
    setChangingPassword,
  ] = useState(false);

  const [
    passwordError,
    setPasswordError,
  ] = useState("");

  const [
    passwordSuccess,
    setPasswordSuccess,
  ] = useState("");

  // =========================
  // Change Password
  // =========================

  async function handleChangePassword(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError(
        "Please fill in all password fields."
      );

      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "New password must be at least 8 characters long."
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setPasswordError(
        "New passwords do not match."
      );

      return;
    }

    if (
      currentPassword ===
      newPassword
    ) {
      setPasswordError(
        "New password must be different from your current password."
      );

      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    try {
      setChangingPassword(true);

      const response =
        await api.put(
          "/auth/change-password",
          {
            currentPassword,
            newPassword,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setPasswordSuccess(
        response.data.message ??
          "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        error
      );

      setPasswordError(
        error.response?.data?.message ??
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  }

  // =========================
  // Logout
  // =========================

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("student");
    localStorage.removeItem("role");
    localStorage.removeItem("adminRole");

    navigate("/login", {
      replace: true,
    });
  }

  // =========================
  // UI
  // =========================

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 overflow-y-auto">
        {/* =========================
            General Settings
        ========================= */}

        <section className="mx-5 bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-6">
            <Settings
              size={22}
              className="text-emerald-600"
            />

            <h1 className="text-xl font-bold">
              Staff Settings
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
              type="button"
              onClick={() =>
                setNotifications(
                  !notifications
                )
              }
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
              type="button"
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

          <button
            type="button"
            className="w-full flex justify-between items-center py-4 border-b"
          >
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
            type="button"
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

        {/* =========================
            Change Password
        ========================= */}

        <section className="mx-5 mt-5 bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <LockKeyhole
              size={20}
              className="text-emerald-600"
            />

            <h2 className="text-lg font-bold">
              Change Password
            </h2>
          </div>

          <form
            onSubmit={
              handleChangePassword
            }
            className="space-y-4"
          >
            {/* Current Password */}

            <div>
              <label className="block text-sm font-medium mb-1">
                Current Password
              </label>

              <input
                type={
                  showPasswords
                    ? "text"
                    : "password"
                }
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(
                    event.target.value
                  )
                }
                autoComplete="current-password"
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter current password"
              />
            </div>

            {/* New Password */}

            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>

              <input
                type={
                  showPasswords
                    ? "text"
                    : "password"
                }
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="At least 8 characters"
              />
            </div>

            {/* Confirm Password */}

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm New Password
              </label>

              <input
                type={
                  showPasswords
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter new password again"
              />
            </div>

            {/* Show Password */}

            <button
              type="button"
              onClick={() =>
                setShowPasswords(
                  !showPasswords
                )
              }
              className="flex items-center gap-2 text-sm text-slate-600"
            >
              {showPasswords ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}

              {showPasswords
                ? "Hide passwords"
                : "Show passwords"}
            </button>

            {/* Error */}

            {passwordError && (
              <div className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600">
                {passwordError}
              </div>
            )}

            {/* Success */}

            {passwordSuccess && (
              <div className="rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
                {passwordSuccess}
              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              disabled={
                changingPassword
              }
              className="w-full bg-emerald-600 text-white font-medium rounded-xl py-3 hover:bg-emerald-700 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {changingPassword
                ? "Changing Password..."
                : "Change Password"}
            </button>
          </form>
        </section>
      </main>

      <AdminBottomNavigation />
    </MobileLayout>
  );
}