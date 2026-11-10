import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DeviceStatus, Panel, PageHeader } from "@/components/dashboard/widgets";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { user } from "@/data/water";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações · AquaSmart" },
      { name: "description", content: "Preferências de notificações, dispositivo e perfil." },
      { property: "og:title", content: "Configurações · AquaSmart" },
      { property: "og:description", content: "Preferências de notificações, dispositivo e perfil." },
    ],
  }),
  component: Config,
});

const notifs = [
  ["Alertas de vazamento", true],
  ["Meta diária ultrapassada", true],
  ["Consumo noturno elevado", true],
  ["Resumo semanal", false],
] as const;

function Config() {
  return (
    <>
      <PageHeader title="Configurações" subtitle="Gerencie seu perfil, dispositivo e notificações." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Perfil">
          <div className="space-y-3">
            <div><Label htmlFor="n">Nome</Label><Input id="n" defaultValue={user.name} className="mt-1" /></div>
            <div><Label htmlFor="r">Residência</Label><Input id="r" defaultValue={user.home} className="mt-1" /></div>
            <div><Label htmlFor="g">Meta diária (litros)</Label><Input id="g" type="number" defaultValue={400} className="mt-1" /></div>
            <Button onClick={() => toast.success("Configurações salvas")}>Salvar</Button>
          </div>
        </Panel>
        <div className="space-y-4">
          <Panel title="Dispositivo">
            <div className="flex items-center justify-between text-sm">
              <div><p className="font-medium">Sensor AquaSmart S2</p><p className="text-xs text-muted-foreground">ID: AQS-302-7F1A · Firmware 2.4.1</p></div>
              <DeviceStatus />
            </div>
          </Panel>
          <Panel title="Notificações">
            <ul className="divide-y">
              {notifs.map(([label, on]) => (
                <li key={label} className="flex items-center justify-between py-3 text-sm">
                  <Label htmlFor={label}>{label}</Label>
                  <Switch id={label} defaultChecked={on} />
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
