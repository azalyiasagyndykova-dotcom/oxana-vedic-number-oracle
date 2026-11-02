import { afterEach, describe, expect, it, vi } from "vitest";
import { updateOwnerPassword } from "@/lib/owner-password.server";

const options = { owner: true, url: "https://auth.example.test", key: "sb_publishable_test", token: "verified-token", current: "Current-2026!", password: "NewPassword-2026!" };
afterEach(() => vi.unstubAllGlobals());

describe("Смена пароля владельца", () => {
  it("передаёт подтверждённый вход и текущий пароль без локальной Auth-сессии", async () => {
    const request = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", request);
    await updateOwnerPassword(options);
    expect(request).toHaveBeenCalledWith("https://auth.example.test/auth/v1/user", {
      method: "PUT",
      headers: { apikey: "sb_publishable_test", Authorization: "Bearer verified-token", "Content-Type": "application/json" },
      body: JSON.stringify({ password: "NewPassword-2026!", current_password: "Current-2026!" }),
    });
  });
  it("клиент не может менять пароль через функцию владельца", async () => {
    const request = vi.fn(); vi.stubGlobal("fetch", request);
    await expect(updateOwnerPassword({ ...options, owner: false })).rejects.toThrow("Действие доступно только владельцу");
    expect(request).not.toHaveBeenCalled();
  });
  it("не считает неверный текущий пароль успешной сменой", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ code: "invalid_credentials" }), { status: 400 })));
    await expect(updateOwnerPassword(options)).rejects.toThrow("Пароль не изменён");
  });
});