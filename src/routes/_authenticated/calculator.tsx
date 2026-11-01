import { createFileRoute } from "@tanstack/react-router";
import { Calculator } from "@/components/Calculator";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/_authenticated/calculator")({ head: () => pageHead("Личный разбор", "Рассчитайте Жизненный Код и сохраните цветной или чёрно-белый личный разбор."), component: Calculator });