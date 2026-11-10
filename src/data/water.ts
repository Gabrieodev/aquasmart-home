// Mock data layer. Replace these functions with API calls when sensors/backend exist.

export type Period = "today" | "7d" | "30d";

export const periodLabels: Record<Period, string> = {
  today: "Hoje",
  "7d": "7 dias",
  "30d": "30 dias",
};

export const DAILY_GOAL = 400;
export const MONTHLY_GOAL = 10000;

export type DailyRecord = { date: string; liters: number };

// Deterministic pseudo-random so SSR and client match
function seeded(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const BASE_DATE = new Date(2026, 10, 9);

export const dailyHistory: DailyRecord[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(BASE_DATE);
  d.setDate(d.getDate() - (29 - i));
  const liters = i === 29 ? 485 : Math.round(340 + seeded(i) * 160);
  return { date: d.toISOString().slice(0, 10), liters };
});

export const hourlyToday = Array.from({ length: 24 }, (_, h) => {
  const peak = h >= 6 && h <= 8 ? 55 : h >= 18 && h <= 21 ? 45 : h >= 11 && h <= 13 ? 30 : h < 5 ? 6 : 12;
  return { label: `${String(h).padStart(2, "0")}h`, liters: Math.round(peak * (0.7 + seeded(h + 100) * 0.6)) };
});

export function formatDay(iso: string, opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit" }) {
  const [y = 0, m = 1, d = 1] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", opts);
}

export function getSeries(period: Period) {
  if (period === "today") return hourlyToday;
  const n = period === "7d" ? 7 : 30;
  return dailyHistory.slice(-n).map((r) => ({
    label: period === "7d" ? formatDay(r.date, { weekday: "short" }).replace(".", "") : formatDay(r.date),
    liters: r.liters,
    goal: DAILY_GOAL,
  }));
}

export const activityDistribution = [
  { key: "banho", name: "Banho", value: 38 },
  { key: "cozinha", name: "Cozinha", value: 22 },
  { key: "lavanderia", name: "Lavanderia", value: 18 },
  { key: "limpeza", name: "Limpeza", value: 12 },
  { key: "outros", name: "Outros", value: 10 },
];

export const overviewStats = {
  today: 485,
  todayDelta: 6.2,
  month: 12450,
  monthDelta: -4.1,
  dailyAvg: 415,
  dailyAvgDelta: -2.3,
  savings: 18,
};

export type AlertType = "critical" | "warning" | "info" | "positive";
export type WaterAlert = { id: string; type: AlertType; title: string; description: string; time: string; read?: boolean };

export const alerts: WaterAlert[] = [
  { id: "a1", type: "critical", title: "Possível vazamento detectado", description: "Fluxo contínuo de 2,1 L/h registrado entre 01h e 05h no ramal da cozinha.", time: "Hoje, 05:12" },
  { id: "a2", type: "warning", title: "Consumo elevado no período noturno", description: "Uso 42% acima da média entre 22h e 00h.", time: "Hoje, 00:30" },
  { id: "a3", type: "warning", title: "Meta diária ultrapassada", description: "O consumo de hoje (485 L) superou a meta de 400 L.", time: "Hoje, 18:40" },
  { id: "a4", type: "positive", title: "Consumo reduzido", description: "Você consumiu 9% menos que na semana anterior.", time: "Ontem, 20:00", read: true },
  { id: "a5", type: "info", title: "Relatório semanal disponível", description: "O resumo do consumo da semana 45 já pode ser consultado.", time: "08/11, 09:00", read: true },
];

export type HistoryRow = { date: string; liters: number; variation: number | null; status: "normal" | "alto" | "baixo" };

export function getHistory(days: number): HistoryRow[] {
  const rows = dailyHistory.map((r, i) => {
    const prev = dailyHistory[i - 1];
    const variation = prev ? ((r.liters - prev.liters) / prev.liters) * 100 : null;
    const status: HistoryRow["status"] = r.liters > DAILY_GOAL + 40 ? "alto" : r.liters < 370 ? "baixo" : "normal";
    return { ...r, variation, status };
  });
  return rows.slice(-days).reverse();
}

export const user = { name: "Gabriel Almeida", home: "Residência · Apto 302", initials: "GA" };
