import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthForm } from "@/components/AuthForm";
import { pageHead } from "@/lib/page-head";
import { getOwnerSetup } from "@/lib/access.functions";
export const Route = createFileRoute("/")({ loader: () => getOwnerSetup(), head: () => pageHead("Первый вход и личный кабинет", "Создание кабинета владельца и личный вход в Жизненный Код."), component: MainEntry });
// Первый вход владельца показывается только по особой ссылке (/?owner) и только пока владельца нет.
// Клиенты на главной странице видят только обычный вход.
function MainEntry() {
  const setup = Route.useLoaderData();
  const [ownerLink, setOwnerLink] = useState(false);
  useEffect(() => { setOwnerLink(new URLSearchParams(window.location.search).has("owner")); }, []);
  const show = setup.available && ownerLink;
  return <AuthForm key={show ? "owner" : "login"} firstOwner={show} />;
}