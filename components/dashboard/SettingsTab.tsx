"use client";

import { useState } from "react";
import { useDashboard } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, Save } from "lucide-react";

export function SettingsTab() {
  const { settings, updateSettings } = useDashboard();
  const [form, setForm] = useState({ ...settings });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName.trim()) {
      setAlert({ type: "error", msg: "El nombre de la empresa es obligatorio." });
      return;
    }
    if (!form.adminEmail.trim() || !/^\S+@\S+\.\S+$/.test(form.adminEmail)) {
      setAlert({ type: "error", msg: "El email de administrador no es válido." });
      return;
    }
    setLoading(true);
    setAlert(null);
    await new Promise((r) => setTimeout(r, 1000));
    updateSettings(form);
    setAlert({ type: "success", msg: "Configuración guardada correctamente." });
    setLoading(false);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Configuración General</CardTitle>
          <CardDescription>Administra las preferencias de la aplicación</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {alert && (
              <Alert variant={alert.type === "error" ? "destructive" : "default"}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{alert.type === "error" ? "Error" : "Éxito"}</AlertTitle>
                <AlertDescription>{alert.msg}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="companyName">Nombre de la Empresa <span className="text-destructive">*</span></Label>
              <Input
                id="companyName"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                placeholder="Lab11 Technologies"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="adminEmail">Email de Administrador <span className="text-destructive">*</span></Label>
              <Input
                id="adminEmail"
                type="email"
                value={form.adminEmail}
                onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                placeholder="admin@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="language">Idioma</Label>
                <Select value={form.language} onValueChange={(v) => setForm({ ...form, language: v || "" })}>
                  <SelectTrigger><SelectValue placeholder="Selecciona idioma" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timezone">Zona Horaria</Label>
                <Select value={form.timezone} onValueChange={(v) => setForm({ ...form, timezone: v || "" })}>
                  <SelectTrigger><SelectValue placeholder="Selecciona zona" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Lima">América/Lima</SelectItem>
                    <SelectItem value="America/Mexico_City">América/México</SelectItem>
                    <SelectItem value="America/Bogota">América/Bogotá</SelectItem>
                    <SelectItem value="America/Santiago">América/Santiago</SelectItem>
                    <SelectItem value="Europe/Madrid">Europa/Madrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="itemsPerPage">Elementos por Página</Label>
              <Select value={String(form.itemsPerPage)} onValueChange={(v) => setForm({ ...form, itemsPerPage: Number(v) })}>
                <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium">Notificaciones por Email</p>
                  <p className="text-xs text-muted-foreground">Recibe alertas importantes por correo</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, emailNotifications: !form.emailNotifications })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.emailNotifications ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.emailNotifications ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium">Recordatorios de Tareas</p>
                  <p className="text-xs text-muted-foreground">Notifica cuando una tarea esté próxima a vencer</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, taskReminders: !form.taskReminders })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.taskReminders ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.taskReminders ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium">Reportes Semanales</p>
                  <p className="text-xs text-muted-foreground">Envía un resumen semanal automático</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, weeklyReports: !form.weeklyReports })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.weeklyReports ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.weeklyReports ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium">Modo Oscuro</p>
                  <p className="text-xs text-muted-foreground">Activa el tema oscuro de la aplicación</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, darkMode: !form.darkMode })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.darkMode ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.darkMode ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading && <Spinner className="mr-2" />}
                <Save className="h-4 w-4 mr-2" />
                Guardar Configuración
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
