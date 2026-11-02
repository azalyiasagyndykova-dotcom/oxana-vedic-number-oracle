import { assertOwner } from "./access";

// The middleware's client has a verified bearer header, but no stored Auth session.
// GoTrue's updateUser requires a stored session, so call its user endpoint directly.
export async function updateOwnerPassword(options: {
  owner: boolean;
  url: string;
  key: string;
  token: string;
  current: string;
  password: string;
}) {
  assertOwner(options.owner);
  const response = await fetch(`${options.url.replace(/\/$/, "")}/auth/v1/user`, {
    method: "PUT",
    headers: {
      apikey: options.key,
      Authorization: `Bearer ${options.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: options.password, current_password: options.current }),
  });
  if (response.ok) return;
  const error = await response.json().catch(() => null) as { code?: string; error_code?: string } | null;
  const code = error?.code ?? error?.error_code;
  if (code === "same_password") throw new Error("Новый пароль должен отличаться от текущего.");
  if (code === "weak_password") throw new Error("Новый пароль слишком простой. Используйте не менее 10 символов, заглавную букву, цифру и знак.");
  if (code === "reauthentication_needed") throw new Error("Выйдите из кабинета, войдите снова и повторите смену пароля.");
  if (response.status === 429) throw new Error("Слишком много попыток. Подождите немного и попробуйте снова.");
  throw new Error("Пароль не изменён. Проверьте текущий пароль и надёжность нового.");
}