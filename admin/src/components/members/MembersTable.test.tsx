import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MembersTable from "./MembersTable";

describe("MembersTable", () => {
  it.each([
    [null, null, "M"],
    ["Mayowa", null, "M"],
    [null, "Smith", "S"],
    ["Mayowa", "Smith", "MS"],
    ["", "", "M"],
  ])("renders initials when names are %s and %s", (firstName, lastName, initials) => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <MembersTable members={[{
          id: 1,
          email: "member@example.com",
          firstName,
          lastName,
          dateAdded: "10/4/2026",
          lastActive: "Never",
        }]} />
      </MemoryRouter>,
    );

    expect(markup).toContain(`>${initials}</span>`);
    expect(markup).toContain("member@example.com");
  });
});
