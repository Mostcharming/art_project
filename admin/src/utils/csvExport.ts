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
