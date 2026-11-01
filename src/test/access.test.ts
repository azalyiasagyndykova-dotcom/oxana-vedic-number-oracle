import { describe, expect, it } from "vitest";
import { accessAllowed, assertOwner, clientSchema, expiresAfterMonths, monthsSchema } from "@/lib/access";
describe("Доступ клиентов", () => {
  for (const [months, expiry] of [[1,"2026-12-01T16:00:00.000Z"],[3,"2027-02-01T16:00:00.000Z"],[6,"2027-05-01T16:00:00.000Z"],[12,"2027-11-01T16:00:00.000Z"]] as const) {
    it(`срок ${months} месяцев`, () => expect(expiresAfterMonths(new Date("2026-11-01T16:00:00Z"), months)).toBe(expiry));
  }
  it("конец месяца не переносится в следующий", () => expect(expiresAfterMonths(new Date("2026-01-31T12:00:00Z"),1)).toBe("2026-02-28T12:00:00.000Z"));
  const access = { starts_at: "2026-11-01T00:00:00Z", expires_at: "2026-12-01T00:00:00Z", revoked: false };
  it("закрытый доступ не действует", () => expect(accessAllowed(false,{...access,revoked:true},Date.parse("2026-11-02"))).toBe(false));
  it("срок истекает точно в дату окончания", () => expect(accessAllowed(false,access,Date.parse(access.expires_at))).toBe(false));
  it("активный клиент получает доступ", () => expect(accessAllowed(false,access,Date.parse("2026-11-02"))).toBe(true));
  it("владелец не ограничен сроком", () => expect(accessAllowed(true,null)).toBe(true));
  it("без выданного доступа клиент не входит", () => expect(accessAllowed(false,null)).toBe(false));
  it("клиент не управляет аккаунтами", () => expect(() => assertOwner(false)).toThrow());
  it("владелец управляет аккаунтами", () => expect(() => assertOwner(true)).not.toThrow());
  it("только разрешённые сроки", () => expect(monthsSchema.safeParse(2).success).toBe(false));
  for (const email of ["client@gmail.com","client@mail.ru","client@outlook.com","client@example.jp"]) it(`принимает почту ${email}`, () => expect(clientSchema.safeParse({name:"Клиент",email,password:"ExampleOnly-2026",months:3}).success).toBe(true));
});