export const STAFF_ROLES = ["dispatcher", "technician", "ops_manager"] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export function isStaffRole(role: string): role is StaffRole {
  return STAFF_ROLES.some((candidate) => candidate === role);
}

export const STAFF_SCREENS = {
  "/dispatch": { role: "dispatcher", title: "Assign jobs" },
  "/technician/jobs": { role: "technician", title: "Update jobs" },
  "/ops/open-jobs": { role: "ops_manager", title: "Open jobs" },
} as const;

export type StaffPath = keyof typeof STAFF_SCREENS;

export function homeForRole(role: StaffRole): StaffPath {
  if (role === "dispatcher") {
    return "/dispatch";
  }
  if (role === "technician") {
    return "/technician/jobs";
  }
  return "/ops/open-jobs";
}
