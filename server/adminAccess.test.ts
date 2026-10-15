import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { resolvePersistedUserRole } from "./db";

const navbar = fs.readFileSync(new URL("../client/src/components/Navbar.tsx", import.meta.url), "utf8");

describe("administrator access", () => {
  it("preserves the project owner's admin role when an OAuth sync supplies a stale role", () => {
    expect(resolvePersistedUserRole("owner-open-id", "user", "owner-open-id")).toBe("admin");
    expect(resolvePersistedUserRole("owner-open-id", "learner", "owner-open-id")).toBe("admin");
    expect(resolvePersistedUserRole("another-user", "trainer", "owner-open-id")).toBe("trainer");
    expect(resolvePersistedUserRole("another-user", undefined, "owner-open-id")).toBeUndefined();
  });

  it("keeps administrator navigation available in desktop and mobile menus", () => {
    expect(navbar).toContain('user.role === "admin"');
    expect(navbar).toContain('href="/admin"');
    expect(navbar).toContain("Admin Panel");
    expect(navbar).toContain('user?.role === "admin"');
  });
});
