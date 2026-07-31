// =========================
// Admin / Staff Roles
// =========================

export type AdminRole =
  | "FACILITATOR"
  | "COORDINATOR"
  | "MENTOR"
  | "ADMIN";

// =========================
// Permissions
// =========================

export type Permission =
  // Students
  | "VIEW_STUDENTS"
  | "CREATE_STUDENTS"
  | "EDIT_STUDENTS"
  | "DELETE_STUDENTS"

  // Attendance
  | "VIEW_ATTENDANCE"
  | "MANAGE_ATTENDANCE"

  // Schedule
  | "VIEW_SCHEDULE"
  | "MANAGE_SCHEDULE"

  // Grievances
  | "VIEW_GRIEVANCES"
  | "MANAGE_GRIEVANCES"

  // Leave
  | "VIEW_LEAVE"
  | "MANAGE_LEAVE"

  // Certificates
  | "VIEW_CERTIFICATES"
  | "MANAGE_CERTIFICATES"

  // Performance
  | "VIEW_PERFORMANCE"
  | "MANAGE_PERFORMANCE"

  // Mentors
  | "VIEW_MENTORS"
  | "ASSIGN_MENTORS"
  | "CREATE_MENTORS"

  // Master Data
  | "VIEW_MASTER_DATA"
  | "MANAGE_MASTER_DATA"

  // Notifications
  | "VIEW_NOTIFICATIONS"
  | "MANAGE_NOTIFICATIONS"

  // Venues
  | "VIEW_VENUES"
  | "ASSIGN_VENUES"
  | "CREATE_VENUES";

// =========================
// Role Permissions
// =========================

const permissions: Record<
  AdminRole,
  Permission[]
> = {
  // =========================
  // FACILITATOR - Ritika
  // =========================

  FACILITATOR: [
    // Students
    "VIEW_STUDENTS",
    "CREATE_STUDENTS",
    "EDIT_STUDENTS",

    // Attendance
    "VIEW_ATTENDANCE",

    // Schedule
    "VIEW_SCHEDULE",

    // Grievances
    "VIEW_GRIEVANCES",

    // Leave
    "VIEW_LEAVE",

    // Certificates
    "VIEW_CERTIFICATES",

    // Performance
    "VIEW_PERFORMANCE",

    // Mentors
    "VIEW_MENTORS",

    // Master Data
    "VIEW_MASTER_DATA",

    // Notifications
    "VIEW_NOTIFICATIONS",

    // Venues
    "VIEW_VENUES",
  ],

  // =========================
  // COORDINATOR - Rashmi
  // =========================

  COORDINATOR: [
    // Students
    "VIEW_STUDENTS",
    "CREATE_STUDENTS",
    "EDIT_STUDENTS",

    // Attendance
    "VIEW_ATTENDANCE",
    "MANAGE_ATTENDANCE",

    // Schedule
    "VIEW_SCHEDULE",
    "MANAGE_SCHEDULE",

    // Grievances
    "VIEW_GRIEVANCES",
    "MANAGE_GRIEVANCES",

    // Leave
    "VIEW_LEAVE",
    "MANAGE_LEAVE",

    // Certificates
    "VIEW_CERTIFICATES",
    "MANAGE_CERTIFICATES",

    // Performance
    "VIEW_PERFORMANCE",
    "MANAGE_PERFORMANCE",

    // Mentors
    "VIEW_MENTORS",
    "ASSIGN_MENTORS",

    // Master Data
    "VIEW_MASTER_DATA",

    // Notifications
    "VIEW_NOTIFICATIONS",
    "MANAGE_NOTIFICATIONS",

    // Venues
    "VIEW_VENUES",
    "ASSIGN_VENUES",
  ],

  // =========================
  // MENTOR
  // =========================

  MENTOR: [
    // Students
    "VIEW_STUDENTS",

    // Attendance
    "VIEW_ATTENDANCE",

    // Schedule
    "VIEW_SCHEDULE",

    // Certificates
    "VIEW_CERTIFICATES",

    // Performance
    "VIEW_PERFORMANCE",
    "MANAGE_PERFORMANCE",
  ],

  // =========================
  // ADMIN - Sir
  // =========================

  ADMIN: [
    // Students
    "VIEW_STUDENTS",
    "CREATE_STUDENTS",
    "EDIT_STUDENTS",
    "DELETE_STUDENTS",

    // Attendance
    "VIEW_ATTENDANCE",
    "MANAGE_ATTENDANCE",

    // Schedule
    "VIEW_SCHEDULE",
    "MANAGE_SCHEDULE",

    // Grievances
    "VIEW_GRIEVANCES",
    "MANAGE_GRIEVANCES",

    // Leave
    "VIEW_LEAVE",
    "MANAGE_LEAVE",

    // Certificates
    "VIEW_CERTIFICATES",
    "MANAGE_CERTIFICATES",

    // Performance
    "VIEW_PERFORMANCE",
    "MANAGE_PERFORMANCE",

    // Mentors
    "VIEW_MENTORS",
    "ASSIGN_MENTORS",
    "CREATE_MENTORS",

    // Master Data
    "VIEW_MASTER_DATA",
    "MANAGE_MASTER_DATA",

    // Notifications
    "VIEW_NOTIFICATIONS",
    "MANAGE_NOTIFICATIONS",

    // Venues
    "VIEW_VENUES",
    "ASSIGN_VENUES",
    "CREATE_VENUES",
  ],
};

// =========================
// Get Current Admin Role
// =========================

export function getAdminRole():
  | AdminRole
  | null {
  const role =
    localStorage.getItem(
      "adminRole"
    );

  if (
    role === "FACILITATOR" ||
    role === "COORDINATOR" ||
    role === "MENTOR" ||
    role === "ADMIN"
  ) {
    return role;
  }

  return null;
}

// =========================
// Permission Check
// =========================

export function hasPermission(
  permission: Permission
): boolean {
  const role =
    getAdminRole();

  if (!role) {
    return false;
  }

  return permissions[
    role
  ].includes(permission);
}

// =========================
// Any Permission Check
// =========================

export function hasAnyPermission(
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.some(
    (permission) =>
      hasPermission(permission)
  );
}

// =========================
// All Permissions Check
// =========================

export function hasAllPermissions(
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.every(
    (permission) =>
      hasPermission(permission)
  );
}