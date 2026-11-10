import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ReferenceLine, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { activityDistribution, DAILY_GOAL } from "@/data/water";

type Point = { label: string; liters: number };

const litersConfig = { liters: { label: "Consumo (L)", color: "var(--chart-1)" } } satisfies ChartConfig;

export function ConsumptionLineChart({ data, showGoal }: { data: Point[]; showGoal?: boolean }) {
  return (
    <ChartContainer config={litersConfig} className="aspect-auto h-64 w-full">
      <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillLiters" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-liters)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--color-liters)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={16} />
        <YAxis tickLine={false} axisLine={false} width={48} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {showGoal && <ReferenceLine y={DAILY_GOAL} stroke="var(--destructive)" strokeDasharray="4 4" label={{ value: "Meta", position: "insideTopRight", fill: "var(--destructive)", fontSize: 11 }} />}
        <Area type="monotone" dataKey="liters" stroke="var(--color-liters)" strokeWidth={2} fill="url(#fillLiters)" activeDot={{ r: 5 }} />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}

export function DailyBarChart({ data }: { data: Point[] }) {
  return (
    <ChartContainer config={litersConfig} className="aspect-auto h-64 w-full">
      <BarChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={8} />
        <YAxis tickLine={false} axisLine={false} width={48} />
        <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent />} />
        <Bar dataKey="liters" radius={[4, 4, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={"goal" in d && d.liters > DAILY_GOAL ? "var(--chart-2)" : "var(--chart-1)"} />
          ))}
        </Bar>
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  );
}

const activityConfig = Object.fromEntries(
  activityDistribution.map((a, i) => [a.key, { label: a.name, color: `var(--chart-${i + 1})` }]),
) satisfies ChartConfig;

export function ActivityPieChart() {
  const data = activityDistribution.map((a) => ({ ...a, fill: `var(--color-${a.key})` }));
  return (
    <ChartContainer config={activityConfig} className="aspect-auto h-72 w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="key" hideLabel formatter={(v, _n, item) => (
          <span className="flex w-full justify-between gap-4"><span>{item.payload.name}</span><span className="font-mono font-medium">{String(v)}%</span></span>
        )} />} />
        <Pie data={data} dataKey="value" nameKey="key" innerRadius={55} outerRadius={85} paddingAngle={2} strokeWidth={2} />
        <ChartLegend content={<ChartLegendContent nameKey="key" />} className="flex-wrap gap-y-1" />
      </PieChart>
    </ChartContainer>
  );
}
