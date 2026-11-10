import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GoalCard, Panel, PageHeader, nf } from "@/components/dashboard/widgets";
import { Slider } from "@/components/ui/slider";
import { overviewStats } from "@/data/water";

export const Route = createFileRoute("/metas")({
  head: () => ({
    meta: [
      { title: "Metas de Economia · AquaSmart" },
      { name: "description", content: "Defina e acompanhe suas metas de economia de água." },
      { property: "og:title", content: "Metas de Economia · AquaSmart" },
      { property: "og:description", content: "Defina e acompanhe suas metas de economia de água." },
    ],
  }),
  component: Metas,
});

const tips = [
  "Feche a torneira ao escovar os dentes — economia de até 12 L por vez.",
  "Use a máquina de lavar apenas com carga completa.",
  "Reaproveite a água da lavanderia para limpar o quintal.",
  "Verifique a caixa acoplada: vazamentos podem gastar 1.000 L por mês.",
];

function Metas() {
  const [reduction, setReduction] = useState(20);
  const base = 12500;
  const goal = Math.round((base * (1 - reduction / 100)) / 50) * 50;
  return (
    <>
      <PageHeader title="Metas de Economia" subtitle="Defina objetivos e acompanhe seu progresso." />
      <div className="grid gap-4 lg:grid-cols-2">
        <GoalCard current={overviewStats.month} goal={goal} reduction={reduction} />
        <Panel title="Ajustar meta" description={`Base: média dos últimos 3 meses (${nf.format(base)} L)`}>
          <p className="text-sm">Redução desejada: <strong className="text-primary-deep">{reduction}%</strong></p>
          <Slider className="mt-4" min={5} max={40} step={1} value={[reduction]} onValueChange={([v]) => setReduction(v ?? 20)} />
          <p className="mt-4 text-sm text-muted-foreground">Nova meta mensal: <strong className="text-foreground">{nf.format(goal)} L</strong></p>
          <h3 className="mt-6 text-sm font-semibold">Dicas para economizar</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            {tips.map((t) => <li key={t} className="rounded-md bg-secondary p-2.5">{t}</li>)}
          </ul>
        </Panel>
      </div>
    </>
  );
}
