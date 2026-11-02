import { describe, expect, it } from "vitest";
import { ownerSetupSchema } from "@/lib/access";

describe("Защита первого входа владельца", () => {
  const data = { email: "owner@example.com", password: "ChosenPassword-2026", confirmPassword: "ChosenPassword-2026" };
  it("владелец может выбрать свою почту и пароль", () => expect(ownerSetupSchema.parse(data).email).toBe("owner@example.com"));
  it("подтверждение должно совпадать", () => expect(ownerSetupSchema.safeParse({ ...data, confirmPassword: "OtherPassword-2026" }).success).toBe(false));
  it("первый вход не требует личного кода активации", () => expect(ownerSetupSchema.safeParse({ email: "new-owner@example.org", password: "MyNewPassword-2026", confirmPassword: "MyNewPassword-2026" }).success).toBe(true));
});