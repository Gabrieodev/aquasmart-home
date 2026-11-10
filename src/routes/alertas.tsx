import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertItem, Panel, PageHeader, PeriodSelector } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { alerts as initial, type AlertType } from "@/data/water";

export const Route = createFileRoute("/alertas")({
  head: () => ({
    meta: [
      { title: "Alertas · AquaSmart" },
      { name: "description", content: "Alertas de vazamento, consumo elevado e metas." },
      { property: "og:title", content: "Alertas · AquaSmart" },
      { property: "og:description", content: "Alertas de vazamento, consumo elevado e metas." },
    ],
  }),
  component: Alertas,
});

const filters = { all: "Todos", critical: "Críticos", warning: "Atenção", positive: "Positivos", info: "Informativos" } as const;

function Alertas() {
  const [list, setList] = useState(initial);
  const [filter, setFilter] = useState<keyof typeof filters>("all");
  const shown = list.filter((a) => filter === "all" || a.type === (filter as AlertType));
  return (
    <>
      <PageHeader title="Alertas" subtitle="Notificações geradas pelo monitoramento do seu consumo.">
        <PeriodSelector value={filter} onChange={setFilter} options={filters} />
        <Button variant="outline" size="sm" onClick={() => setList((l) => l.map((a) => ({ ...a, read: true })))}>Marcar todos como lidos</Button>
      </PageHeader>
      <Panel>
        {shown.length ? (
          <ul className="space-y-1">
            {shown.map((a) => (
              <AlertItem key={a.id} alert={a} onRead={() => setList((l) => l.map((x) => (x.id === a.id ? { ...x, read: true } : x)))} />
            ))}
          </ul>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">Nenhum alerta nesta categoria.</p>
        )}
      </Panel>
    </>
  );
}
