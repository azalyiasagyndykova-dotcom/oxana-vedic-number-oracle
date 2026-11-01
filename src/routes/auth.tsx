import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/auth")({ head: () => pageHead("Вход в кабинет", "Войдите по почте и паролю в личный кабинет Жизненного Кода."), component: AuthForm });