import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Panel, PageHeader, PeriodSelector, nf } from "@/components/dashboard/widgets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDay, getHistory } from "@/data/water";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/historico")({
  head: () => ({
    meta: [
      { title: "Histórico · AquaSmart" },
      { name: "description", content: "Histórico diário do consumo de água da residência." },
      { property: "og:title", content: "Histórico · AquaSmart" },
      { property: "og:description", content: "Histórico diário do consumo de água da residência." },
    ],
  }),
  component: Historico,
});

const ranges = { "7": "7 dias", "15": "15 dias", "30": "30 dias" } as const;
type Range = keyof typeof ranges;
const statusStyle = { normal: "bg-secondary text-primary-deep", alto: "bg-danger-soft text-destructive", baixo: "bg-success-soft text-success" };
const statusLabel = { normal: "Normal", alto: "Elevado", baixo: "Econômico" };

function Historico() {
  const [range, setRange] = useState<Range>("7");
  const rows = getHistory(Number(range));
  return (
    <>
      <PageHeader title="Histórico" subtitle="Consulte o consumo registrado dia a dia.">
        <PeriodSelector value={range} onChange={setRange} options={ranges} />
      </PageHeader>
      <Panel>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Consumo</TableHead>
                <TableHead className="text-right">Variação</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.date}>
                  <TableCell className="capitalize">{formatDay(r.date, { weekday: "short", day: "2-digit", month: "short" })}</TableCell>
                  <TableCell className="text-right tabular-nums">{nf.format(r.liters)} L</TableCell>
                  <TableCell className={cn("text-right tabular-nums", r.variation == null ? "text-muted-foreground" : r.variation > 0 ? "text-destructive" : "text-success")}>
                    {r.variation == null ? "—" : `${r.variation > 0 ? "+" : ""}${r.variation.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`}
                  </TableCell>
                  <TableCell><span className={cn("rounded px-2 py-0.5 text-xs font-medium", statusStyle[r.status])}>{statusLabel[r.status]}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>
    </>
  );
}
