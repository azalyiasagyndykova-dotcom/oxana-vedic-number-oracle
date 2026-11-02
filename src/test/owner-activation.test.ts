import { describe, expect, it } from "vitest";
import { ownerSetupSchema, validActivationCode } from "@/lib/access";

describe("Защита первого входа владельца", () => {
  const data = { email: "owner@example.com", password: "ChosenPassword-2026", confirmPassword: "ChosenPassword-2026", activationCode: "PrivateExampleCode" };
  it("владелец может выбрать свою почту и пароль", () => expect(ownerSetupSchema.parse(data).email).toBe("owner@example.com"));
  it("подтверждение должно совпадать", () => expect(ownerSetupSchema.safeParse({ ...data, confirmPassword: "OtherPassword-2026" }).success).toBe(false));
  it("без настроенного личного кода активация закрыта", async () => expect(await validActivationCode("any", undefined)).toBe(false));
  it("неверный код не даёт права владельца", async () => expect(await validActivationCode("WrongCode", "PrivateExampleCode")).toBe(false));
  it("личный код принимается только при точном совпадении", async () => expect(await validActivationCode("PrivateExampleCode", "PrivateExampleCode")).toBe(true));
});