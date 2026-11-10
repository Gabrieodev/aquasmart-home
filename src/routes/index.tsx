import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, Droplet, Gauge, PiggyBank } from "lucide-react";
import { DeviceStatus, GoalCard, Panel, PageHeader, PeriodSelector, StatCard, AlertItem, nf } from "@/components/dashboard/widgets";
import { ActivityPieChart, ConsumptionLineChart, DailyBarChart } from "@/components/dashboard/charts";
import { alerts, getSeries, overviewStats, periodLabels, type Period } from "@/data/water";
import { useLiveReading } from "@/hooks/use-live-reading";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão Geral · AquaSmart" },
      { name: "description", content: "Painel do consumo de água da sua residência em tempo real." },
      { property: "og:title", content: "Visão Geral · AquaSmart" },
      { property: "og:description", content: "Painel do consumo de água da sua residência em tempo real." },
    ],
  }),
  component: Overview,
});

function Overview() {
  const [period, setPeriod] = useState<Period>("7d");
  const { value: today, updatedAt } = useLiveReading(overviewStats.today);
  const series = getSeries(period);
  const barSeries = getSeries(period === "today" ? "7d" : period);
  const s = overviewStats;

  return (
    <>
      <PageHeader title="Visão Geral" subtitle="Acompanhe o consumo de água da sua residência.">
        <DeviceStatus />
        <PeriodSelector value={period} onChange={setPeriod} />
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Droplet} label="Consumo de hoje" value={nf.format(today)} unit="L" delta={s.todayDelta} deltaLabel="vs. ontem"
          hint={`Leitura do sensor atualizada às ${updatedAt?.toLocaleTimeString("pt-BR") ?? "--"}.`} />
        <StatCard icon={CalendarDays} label="Consumo do mês" value={nf.format(s.month)} unit="L" delta={s.monthDelta} deltaLabel="vs. mês anterior"
          hint="Total acumulado desde o dia 1º do mês corrente." />
        <StatCard icon={Gauge} label="Média diária" value={nf.format(s.dailyAvg)} unit="L" delta={s.dailyAvgDelta} deltaLabel="vs. mês anterior"
          hint="Média de consumo por dia nos últimos 30 dias." />
        <StatCard icon={PiggyBank} label="Economia mensal" value={`${s.savings}%`} delta={s.savings} lowerIsBetter={false} deltaLabel="vs. mês anterior"
          hint="Redução do consumo em comparação com o mesmo período do mês anterior." />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title="Consumo ao longo do tempo" description={period === "today" ? "Litros por hora · hoje" : `Litros por dia · ${periodLabels[period]}`}>
          <ConsumptionLineChart data={series} showGoal={period !== "today"} />
        </Panel>
        <Panel title="Distribuição por atividade" description="Participação no consumo do mês">
          <ActivityPieChart />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title="Comparativo diário" description="Barras escuras indicam dias acima da meta diária (400 L)">
          <DailyBarChart data={barSeries} />
        </Panel>
        <GoalCard current={s.month} reduction={20} />
      </div>

      <Panel className="mt-4" title="Alertas recentes" action={<Link to="/alertas" className="text-xs font-medium text-primary hover:underline">Ver todos</Link>}>
        <ul className="grid gap-1 md:grid-cols-2">
          {alerts.slice(0, 4).map((a) => <AlertItem key={a.id} alert={a} />)}
        </ul>
      </Panel>
    </>
  );
}
