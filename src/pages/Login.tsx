import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LogIn,
  User,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import api from "../api/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] =
    useState(false);

  // =========================
  // Clear Existing Session
  // =========================

  function clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("student");
    localStorage.removeItem("role");
    localStorage.removeItem("adminRole");
  }

  // =========================
  // Login
  // =========================

  async function login() {
    if (!email.trim() || !password) {
      setError(
        "Email and password are required."
      );

      return;
    }

    setError("");
    setLoading(true);

    // Remove any old login before
    // attempting a new one.
    clearSession();

    try {
      // =========================
      // Try Staff Login
      // =========================

      try {
        const response = await api.post(
          "/auth/login",
          {
            email: email
              .trim()
              .toLowerCase(),
            password,
          }
        );

        const {
          token,
          admin,
        } = response.data;

        if (
          !token ||
          !admin ||
          !admin.role
        ) {
          throw new Error(
            "Invalid staff login response."
          );
        }

        // JWT
        localStorage.setItem(
          "token",
          token
        );

        // Full staff account
        localStorage.setItem(
          "admin",
          JSON.stringify(admin)
        );

        // General account type
        localStorage.setItem(
          "role",
          "admin"
        );

        // Specific staff permission
        // FACILITATOR
        // COORDINATOR
        // ADMIN
        localStorage.setItem(
          "adminRole",
          admin.role
        );

        navigate(
          "/admin/dashboard",
          {
            replace: true,
          }
        );

        return;
      } catch (adminError: any) {
        // A 401 means the credentials
        // weren't for a staff account,
        // so try student login.
        if (
          adminError.response &&
          adminError.response.status !== 401
        ) {
          throw adminError;
        }

        // A locally thrown error, such as
        // malformed response data, should
        // not fall through to student login.
        if (!adminError.response) {
          throw adminError;
        }
      }

      // =========================
      // Try Student Login
      // =========================

      const response = await api.post(
        "/auth/student/login",
        {
          email: email
            .trim()
            .toLowerCase(),
          password,
        }
      );

      const {
        token,
        student,
      } = response.data;

      if (
        !token ||
        !student
      ) {
        throw new Error(
          "Invalid student login response."
        );
      }

      // JWT
      localStorage.setItem(
        "token",
        token
      );

      // Student information
      localStorage.setItem(
        "student",
        JSON.stringify(student)
      );

      // Account type
      localStorage.setItem(
        "role",
        "student"
      );

      // Students never have an
      // admin permission role.
      localStorage.removeItem(
        "adminRole"
      );

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );
    } catch (error: any) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      // Make sure a failed login doesn't
      // leave behind a partial session.
      clearSession();

      setError(
        error.response?.data?.message ??
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // Enter Key
  // =========================

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (
      e.key === "Enter" &&
      !loading
    ) {
      login();
    }
  }

  // =========================
  // UI
  // =========================

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-5">

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">

        {/* =========================
            Header
        ========================= */}

        <h1 className="text-3xl font-bold text-center text-emerald-600">
          Stand & Stride
        </h1>

        <p className="text-center text-slate-500 mt-2">
          Junior Internship Management
        </p>

        {/* =========================
            Login Form
        ========================= */}

        <div className="mt-8 space-y-4">

          {/* Email */}

          <div className="relative">

            <User
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              disabled={loading}
              autoComplete="email"
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              className="w-full border rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
            />

          </div>

          {/* Password */}

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={password}
              disabled={loading}
              autoComplete="current-password"
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              className="w-full border rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
            />

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setShowPassword(
                  (current) =>
                    !current
                )
              }
              className="absolute right-3 top-3 text-slate-500 disabled:opacity-60"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >

              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}

            </button>

          </div>

          {/* Error */}

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Login Button */}

          <button
            type="button"
            onClick={login}
            disabled={loading}
            className="w-full bg-emerald-600 text-white rounded-lg py-3 flex items-center justify-center gap-2 disabled:opacity-70"
          >

            <LogIn size={18} />

            {loading
              ? "Signing In..."
              : "Login"}

          </button>

        </div>

      </div>

    </main>
  );
}