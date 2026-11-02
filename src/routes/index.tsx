import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";
import { pageHead } from "@/lib/page-head";
import { getOwnerSetup } from "@/lib/access.functions";
export const Route = createFileRoute("/")({ loader: () => getOwnerSetup(), head: () => pageHead("Первый вход и личный кабинет", "Создание кабинета владельца и личный вход в Жизненный Код."), component: MainEntry });
function MainEntry() { const setup = Route.useLoaderData(); return <AuthForm firstOwner={setup.available} />; }