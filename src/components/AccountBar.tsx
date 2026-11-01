import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AccountBar({ owner, expires }: { owner: boolean; expires?: string | undefined }) {
  const cache = useQueryClient();
  const navigate = useNavigate();
  async function logout() {
    await cache.cancelQueries(); cache.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/auth", replace: true });
  }
  return <div className="no-print flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card px-4 py-3 text-sm">
    <div className="flex flex-wrap items-center gap-3"><Link to="/calculator" className="font-semibold text-primary">Жизненный Код</Link>{owner ? <Link to="/owner" className="text-primary underline">Кабинет владельца</Link> : expires && <span className="text-muted-foreground">Доступ до {new Date(expires).toLocaleDateString("ru-RU")}</span>}</div>
    <Button variant="ghost" onClick={logout}><LogOut />Выйти</Button>
  </div>;
}