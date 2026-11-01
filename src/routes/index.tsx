import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/")({ head: () => pageHead("Личный вход", "Вход в Жизненный Код для клиентов с доступом от владельца."), component: AuthForm });