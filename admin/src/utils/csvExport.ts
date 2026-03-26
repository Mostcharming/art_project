import type { Member, RoleWithMembers } from "../store/membersStore";

/**
 * Convert data to CSV format
 */
function convertToCSV(roles: RoleWithMembers[]): string {
  const headers = [
    "Role",
    "Role Description",
    "Admin Name",
    "Email",
    "Date Added",
    "Last Active",
  ];
  const rows: string[] = [headers.map((h) => `"${h}"`).join(",")];

  roles.forEach((role) => {
    role.members.forEach((member: Member) => {
      const row = [
        `"${role.name}"`,
        `"${role.description.replace(/"/g, '""')}"`,
        `"${member.firstName} ${member.lastName}"`,
        `"${member.email}"`,
        `"${member.dateAdded}"`,
        `"${member.lastActive}"`,
      ];
      rows.push(row.join(","));
    });
  });

  return rows.join("\n");
}

/**
 * Download CSV file to user's browser
 */
export function downloadCSV(
  roles: RoleWithMembers[],
  filename: string = "members.csv"
): void {
  try {
    const csvContent = convertToCSV(roles);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading CSV:", error);
    throw new Error("Failed to download CSV file");
  }
}

/**
 * Export members data as CSV with timestamp
 */
export function exportMembersAsCSV(roles: RoleWithMembers[]): void {
  const timestamp = new Date().toISOString().split("T")[0];
  downloadCSV(roles, `members-${timestamp}.csv`);
}

/**
 * Convert activity log data to CSV format
 */
function convertActivityLogsToCSV(logs: unknown[]): string {
  const headers = [
    "Admin Name",
    "Action",
    "Entity Type",
    "Entity ID",
    "Status",
    "Details",
    "IP Address",
    "User Agent",
    "Date & Time",
  ];
  const rows: string[] = [headers.map((h) => `"${h}"`).join(",")];

  logs.forEach((log) => {
    const logEntry = log as Record<string, unknown>;
    const admin = logEntry.admin as Record<string, unknown>;
    const adminName =
      `${admin?.firstName || ""} ${admin?.lastName || ""}`.trim() || "Unknown";

    // Serialize details object to JSON string
    const detailsStr = logEntry.details
      ? JSON.stringify(logEntry.details).replace(/"/g, '""')
      : "";

    const row = [
      `"${adminName}"`,
      `"${logEntry.action || ""}"`,
      `"${logEntry.entityType || ""}"`,
      `"${logEntry.entityId || ""}"`,
      `"${logEntry.status || ""}"`,
      `"${detailsStr}"`,
      `"${logEntry.ipAddress || ""}"`,
      `"${logEntry.userAgent || ""}"`,
      `"${logEntry.createdAt || ""}"`,
    ];
    rows.push(row.join(","));
  });

  return rows.join("\n");
}

/**
 * Export activity logs data as CSV with timestamp
 */
export function exportActivityLogsAsCSV(logs: unknown[]): void {
  try {
    const csvContent = convertActivityLogsToCSV(logs);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    const timestamp = new Date().toISOString().split("T")[0];
    link.setAttribute("download", `activity-logs-${timestamp}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting activity logs:", error);
    throw new Error("Failed to export activity logs as CSV");
  }
}

/**
 * Convert carousel data to CSV format
 */
function convertCarouselsToCSV(carousels: unknown[]): string {
  const headers = [
    "Carousel ID",
    "Carousel Title",
    "Creator Name",
    "Creator Type",
    "Carousel Length",
    "Art Category",
    "Status",
    "Submission Date",
    "Views",
    "Favorites",
    "Shares",
  ];
  const rows: string[] = [headers.map((h) => `"${h}"`).join(",")];

  carousels.forEach((item) => {
    const carousel = item as Record<string, unknown>;
    const row = [
      carousel.id,
      `"${(carousel.name || "").toString().replace(/"/g, '""')}"`,
      `"${(carousel.publisherName || "").toString().replace(/"/g, '""')}"`,
      `"${carousel.publisherType || ""}"`,
      carousel.carouselLength,
      `"${(carousel.artCategory || "").toString().replace(/"/g, '""')}"`,
      `"${carousel.status || ""}"`,
      `"${carousel.createdAt || ""}"`,
      carousel.views,
      carousel.numberOfFavorites,
      carousel.numberOfShares,
    ];
    rows.push(row.join(","));
  });

  return rows.join("\n");
}

/**
 * Export carousels data as CSV with timestamp
 */
export function exportCarouselsAsCSV(carousels: unknown[]): void {
  try {
    if (!carousels || carousels.length === 0) {
      console.warn("No carousel data to export");
      return;
    }

    const csvContent = convertCarouselsToCSV(carousels);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    const timestamp = new Date().toISOString().split("T")[0];
    link.setAttribute("download", `carousels-${timestamp}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting carousels:", error);
    throw new Error("Failed to export carousels as CSV");
  }
}
