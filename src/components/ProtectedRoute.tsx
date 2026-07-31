import {
  Navigate,
} from "react-router-dom";

import type {
  ReactNode,
} from "react";

import {
  hasPermission,
} from "../utils/permissions";

import type {
  Permission,
} from "../utils/permissions";

// =========================
// Props
// =========================

interface Props {
  children: ReactNode;

  // Restrict route to student/admin
  role?: "student" | "admin";

  // Optional staff permission
  permission?: Permission;
}

// =========================
// Protected Route
// =========================

export default function ProtectedRoute({
  children,
  role,
  permission,
}: Props) {
  const token =
    localStorage.getItem("token");

  const userRole =
    localStorage.getItem("role");

  // =========================
  // Not Logged In
  // =========================

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // =========================
  // Wrong Account Type
  // =========================

  if (
    role &&
    userRole !== role
  ) {
    if (
      userRole === "student"
    ) {
      return (
        <Navigate
          to="/dashboard"
          replace
        />
      );
    }

    if (
      userRole === "admin"
    ) {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // =========================
  // Staff Permission
  // =========================

  if (
    permission &&
    !hasPermission(permission)
  ) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  // =========================
  // Authorized
  // =========================

  return <>{children}</>;
}