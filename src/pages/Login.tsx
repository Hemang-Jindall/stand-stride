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
  const [showPassword, setShowPassword] = useState(false);

  async function login() {
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setError("");
    setLoading(true);

    // Clear any old session before logging in
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("student");
    localStorage.removeItem("role");

    try {
      // =========================
      // Try Admin Login
      // =========================

      try {
        const response = await api.post("/auth/login", {
          email: email.trim(),
          password,
        });

        localStorage.setItem(
          "token",
          response.data.token
        );

        localStorage.setItem(
          "admin",
          JSON.stringify(response.data.admin)
        );

        localStorage.setItem(
          "role",
          "admin"
        );

        navigate("/admin/dashboard");
        return;
      } catch (adminError: any) {
        // Only try student login when admin credentials
        // were rejected normally.
        if (
          adminError.response &&
          adminError.response.status !== 401
        ) {
          throw adminError;
        }
      }

      // =========================
      // Try Student Login
      // =========================

      const response = await api.post(
        "/auth/student/login",
        {
          email: email.trim(),
          password,
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "student",
        JSON.stringify(response.data.student)
      );

      localStorage.setItem(
        "role",
        "student"
      );

      navigate("/dashboard");

    } catch (error: any) {
      console.error("LOGIN ERROR:", error);

      setError(
        error.response?.data?.message ??
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter" && !loading) {
      login();
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-5">

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">

        <h1 className="text-3xl font-bold text-center text-emerald-600">
          Stand & Stride
        </h1>

        <p className="text-center text-slate-500 mt-2">
          Junior Internship Management
        </p>

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
              onChange={(e) =>
                setEmail(e.target.value)
              }
              onKeyDown={handleKeyDown}
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
              onChange={(e) =>
                setPassword(e.target.value)
              }
              onKeyDown={handleKeyDown}
              className="w-full border rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
            />

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-3 top-3 text-slate-500 disabled:opacity-60"
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

          {/* Login */}

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

        {/* Demo Accounts */}

        <div className="mt-8">

          <h2 className="font-semibold text-slate-700 mb-3">
            Demo Login
          </h2>

          <div className="space-y-3">

            <div className="rounded-lg bg-slate-100 p-3">

              <p className="font-semibold">
                👨‍💼 Admin
              </p>

              <p className="text-sm text-slate-600">
                admin@standstride.com
              </p>

              <p className="text-sm text-slate-600">
                admin123
              </p>

            </div>

            <div className="rounded-lg bg-slate-100 p-3">

              <p className="font-semibold">
                👨‍🎓 Student
              </p>

              <p className="text-sm text-slate-600">
                hemang@example.com
              </p>

              <p className="text-sm text-slate-600">
                password
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}