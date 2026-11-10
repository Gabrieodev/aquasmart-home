import type { ReactNode } from "react";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, CheckCircle2, Info, OctagonAlert, Wifi, type LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { MONTHLY_GOAL, periodLabels, type AlertType, type Period, type WaterAlert } from "@/data/water";
import { cn } from "@/lib/utils";

export const nf = new Intl.NumberFormat("pt-BR");

export function Panel({ title, description, action, children, className }: { title?: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-lg border bg-card p-5 shadow-card", className)}>
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <div>
            {title && <h2 className="text-sm font-semibold">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </div>
  );
}

export function DeviceStatus() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
      </span>
      <Wifi className="h-3.5 w-3.5 text-success" />
      Dispositivo conectado
    </span>
  );
}

export function PeriodSelector<T extends string = Period>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options?: Record<T, string> }) {
  const opts = (options ?? periodLabels) as Record<T, string>;
  return (
    <div className="inline-flex rounded-md border bg-card p-0.5" role="group">
      {(Object.keys(opts) as T[]).map((k) => (
        <button
          key={k}
          onClick={() => onChange(k)}
          className={cn(
            "rounded px-3 py-1.5 text-xs font-medium transition-colors",
            value === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {opts[k]}
        </button>
      ))}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, unit, delta, deltaLabel, hint, lowerIsBetter = true }: {
  icon: LucideIcon; label: string; value: string; unit?: string; delta: number; deltaLabel: string; hint: string; lowerIsBetter?: boolean;
}) {
  const good = lowerIsBetter ? delta <= 0 : delta >= 0;
  const Arrow = delta >= 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-default rounded-lg border bg-card p-5 shadow-card transition-colors hover:border-primary/40">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-primary">
                <Icon className="h-4.5 w-4.5" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
              {value}
              {unit && <span className="ml-1 text-sm font-medium text-muted-foreground">{unit}</span>}
            </p>
            <p className="mt-2 flex items-center gap-1 text-xs">
              <span className={cn("inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-medium", good ? "bg-success-soft text-success" : "bg-danger-soft text-destructive")}>
                <Arrow className="h-3 w-3" />
                {Math.abs(delta).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%
              </span>
              <span className="text-muted-foreground">{deltaLabel}</span>
            </p>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-56">{hint}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const alertStyle: Record<AlertType, { icon: LucideIcon; box: string; label: string }> = {
  critical: { icon: OctagonAlert, box: "bg-danger-soft text-destructive", label: "Crítico" },
  warning: { icon: AlertTriangle, box: "bg-warning-soft text-warning", label: "Atenção" },
  info: { icon: Info, box: "bg-secondary text-primary", label: "Informativo" },
  positive: { icon: CheckCircle2, box: "bg-success-soft text-success", label: "Positivo" },
};

export function AlertItem({ alert, onRead }: { alert: WaterAlert; onRead?: () => void }) {
  const s = alertStyle[alert.type];
  return (
    <li className={cn("flex gap-3 rounded-md p-3 transition-colors hover:bg-muted", !alert.read && "bg-muted/60")}>
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-md", s.box)}>
        <s.icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">{alert.title}</p>
          <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", s.box)}>{s.label}</span>
          {!alert.read && <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-label="Não lido" />}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{alert.description}</p>
        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>{alert.time}</span>
          {onRead && !alert.read && (
            <button onClick={onRead} className="font-medium text-primary hover:underline">Marcar como lido</button>
          )}
        </div>
      </div>
    </li>
  );
}

export function GoalCard({ current, goal = MONTHLY_GOAL, reduction }: { current: number; goal?: number; reduction: number }) {
  const pct = Math.round((current / goal) * 100);
  const over = current > goal;
  return (
    <Panel title="Meta de economia" description="Novembro de 2026">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Consumo atual</p>
          <p className="text-2xl font-semibold tabular-nums">{nf.format(current)} <span className="text-sm text-muted-foreground">L</span></p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Meta mensal</p>
          <p className="text-sm font-semibold tabular-nums">{nf.format(goal)} L</p>
        </div>
      </div>
      <Progress value={Math.min(pct, 100)} className={cn("mt-4 h-2.5", over && "[&>div]:bg-destructive")} />
      <div className="mt-2 flex justify-between text-xs">
        <span className={cn("font-medium", over ? "text-destructive" : "text-success")}>{pct}% da meta</span>
        <span className="text-muted-foreground">{over ? `${nf.format(current - goal)} L acima` : `${nf.format(goal - current)} L restantes`}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-secondary p-3">
          <p className="text-xs text-muted-foreground">Redução desejada</p>
          <p className="text-lg font-semibold text-primary-deep">{reduction}%</p>
        </div>
        <div className="rounded-md bg-secondary p-3">
          <p className="text-xs text-muted-foreground">Média diária ideal</p>
          <p className="text-lg font-semibold text-primary-deep">{nf.format(Math.round(goal / 30))} L</p>
        </div>
      </div>
      <p className="mt-4 rounded-md border border-dashed p-3 text-xs text-muted-foreground">
        💧 Reduzir o banho em 2 minutos economiza cerca de 24 litros por dia. Pequenas mudanças fazem diferença!
      </p>
    </Panel>
  );
}
