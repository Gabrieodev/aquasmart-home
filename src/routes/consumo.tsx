import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DeviceStatus, Panel, PageHeader, PeriodSelector, nf } from "@/components/dashboard/widgets";
import { ActivityPieChart, ConsumptionLineChart, DailyBarChart } from "@/components/dashboard/charts";
import { activityDistribution, getSeries, overviewStats, type Period } from "@/data/water";

export const Route = createFileRoute("/consumo")({
  head: () => ({
    meta: [
      { title: "Consumo de Água · AquaSmart" },
      { name: "description", content: "Detalhamento do consumo de água por período e atividade." },
      { property: "og:title", content: "Consumo de Água · AquaSmart" },
      { property: "og:description", content: "Detalhamento do consumo de água por período e atividade." },
    ],
  }),
  component: Consumo,
});

function Consumo() {
  const [period, setPeriod] = useState<Period>("30d");
  const series = getSeries(period);
  const total = series.reduce((a, b) => a + b.liters, 0);
  const peak = series.reduce((a, b) => (b.liters > a.liters ? b : a), series[0] ?? { label: "-", liters: 0 });
  return (
    <>
      <PageHeader title="Consumo de Água" subtitle="Analise em detalhe como a água é utilizada.">
        <DeviceStatus />
        <PeriodSelector value={period} onChange={setPeriod} />
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Total no período", `${nf.format(total)} L`],
          ["Pico", `${nf.format(peak.liters)} L · ${peak.label}`],
          ["Vazão média atual", "6,8 L/min"],
        ].map(([l, v]) => (
          <Panel key={l}><p className="text-sm text-muted-foreground">{l}</p><p className="mt-1 text-xl font-semibold">{v}</p></Panel>
        ))}
      </div>
      <div className="mt-4 grid gap-4">
        <Panel title="Evolução do consumo"><ConsumptionLineChart data={series} showGoal={period !== "today"} /></Panel>
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Consumo por período"><DailyBarChart data={series} /></Panel>
          <Panel title="Por atividade doméstica">
            <ActivityPieChart />
            <ul className="mt-2 divide-y text-sm">
              {activityDistribution.map((a) => (
                <li key={a.key} className="flex justify-between py-2">
                  <span>{a.name}</span>
                  <span className="tabular-nums text-muted-foreground">{nf.format(Math.round((overviewStats.month * a.value) / 100))} L · {a.value}%</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
