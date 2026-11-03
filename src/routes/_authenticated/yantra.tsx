import { createFileRoute } from "@tanstack/react-router";
import { YantraCalculator } from "@/components/YantraCalculator";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/_authenticated/yantra")({
  head: () => pageHead("Код Янтры — личный разбор", "Матрица Янтры, шестнадцать сфер жизни и практические рекомендации. Личный цветной и чёрно-белый разбор."),
  component: YantraCalculator,
});