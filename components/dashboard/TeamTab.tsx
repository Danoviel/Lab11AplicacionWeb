"use client";

import { useState } from "react";
import { useDashboard, type TeamMember } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AlertCircle, Plus, Trash2, Pencil, CalendarIcon } from "lucide-react";

export function TeamTab() {
  const { team, projects, addTeamMember, updateTeamMember, deleteTeamMember } = useDashboard();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; msg: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dateOpen, setDateOpen] = useState(false);

  const [form, setForm] = useState<Omit<TeamMember, "id">>({
    userId: "",
    role: "",
    name: "",
    email: "",
    position: "",
    birthdate: "",
    phone: "",
    projectId: null,
    isActive: true,
  });

  const reset = () => {
    setForm({ userId: "", role: "", name: "", email: "", position: "", birthdate: "", phone: "", projectId: null, isActive: true });
    setAlert(null);
    setEditingId(null);
    setDateOpen(false);
  };

  const validate = () => {
    if (!form.name.trim()) return "El nombre es obligatorio.";
    if (!form.email.trim()) return "El email es obligatorio.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "El email no es válido.";
    if (!form.userId.trim()) return "El userId es obligatorio.";
    if (!form.role.trim()) return "El rol es obligatorio.";
    if (!form.position.trim()) return "La posición es obligatoria.";
    if (!form.birthdate) return "La fecha de nacimiento es obligatoria.";
    if (!form.phone.trim()) return "El teléfono es obligatorio.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setAlert({ type: "error", msg: err });
      return;
    }
    setLoading(true);
    setAlert(null);
    await new Promise((r) => setTimeout(r, 800));
    if (editingId) {
      updateTeamMember(editingId, form);
      setAlert({ type: "success", msg: "Miembro actualizado correctamente." });
    } else {
      addTeamMember(form);
      setAlert({ type: "success", msg: "Miembro agregado correctamente." });
    }
    setLoading(false);
    setTimeout(() => { setOpen(false); reset(); }, 600);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este miembro del equipo?")) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    deleteTeamMember(id);
    setLoading(false);
  };

  const startEdit = (m: TeamMember) => {
    setEditingId(m.id);
    setForm({
      userId: m.userId,
      role: m.role,
      name: m.name,
      email: m.email,
      position: m.position,
      birthdate: m.birthdate,
      phone: m.phone,
      projectId: m.projectId,
      isActive: m.isActive,
    });
    setAlert(null);
    setOpen(true);
  };

  const selectedDate = form.birthdate ? new Date(form.birthdate + "T00:00:00") : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Equipo</h2>
        <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); setOpen(o); }}>
          <DialogTrigger>
            <span className="inline-flex items-center justify-center rounded-lg text-sm font-medium bg-primary text-primary-foreground h-8 px-2.5 gap-1.5 cursor-pointer">
              <Plus className="h-4 w-4" /> Nuevo Miembro
            </span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Miembro" : "Agregar Miembro"}</DialogTitle>
                <DialogDescription>Completa los datos del miembro del equipo.</DialogDescription>
              </DialogHeader>

              {alert && (
                <Alert variant={alert.type === "error" ? "destructive" : "default"} className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{alert.type === "error" ? "Error" : "Éxito"}</AlertTitle>
                  <AlertDescription>{alert.msg}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>User ID <span className="text-destructive">*</span></Label>
                    <Input value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} placeholder="usr_001" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Nombre <span className="text-destructive">*</span></Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre completo" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Email <span className="text-destructive">*</span></Label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="correo@example.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Teléfono <span className="text-destructive">*</span></Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+51 999 999 999" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Rol <span className="text-destructive">*</span></Label>
                    <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Ej: Frontend Developer" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Posición <span className="text-destructive">*</span></Label>
                    <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Ej: Senior Developer" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Fecha de Nacimiento <span className="text-destructive">*</span></Label>
                    <Popover open={dateOpen} onOpenChange={setDateOpen}>
                      <PopoverTrigger>
                        <span className="inline-flex items-center justify-center rounded-lg text-sm font-medium border border-border bg-background hover:bg-muted h-8 px-2.5 w-full text-left font-normal cursor-pointer gap-1.5">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                        </span>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            if (date) {
                              setForm({ ...form, birthdate: format(date, "yyyy-MM-dd") });
                              setDateOpen(false);
                            }
                          }}
                      />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <Label>Proyecto Asignado</Label>
                    <Select value={form.projectId || "null"} onValueChange={(v) => setForm({ ...form, projectId: v === "null" ? null : v })}>
                      <SelectTrigger><SelectValue placeholder="Sin proyecto" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">Sin proyecto</SelectItem>
                        {projects.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">Miembro activo</Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setOpen(false); reset(); }}>Cancelar</Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Spinner className="mr-2" />}
                  {editingId ? "Guardar Cambios" : "Agregar Miembro"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Miembros del Equipo</CardTitle>
          <CardDescription>Gestiona los miembros de tu equipo y sus roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {team.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role} — {member.position}</p>
                    <p className="text-xs text-muted-foreground">{member.email} | {member.phone}</p>
                    <p className="text-xs text-muted-foreground">Nac: {member.birthdate} | UID: {member.userId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={member.isActive ? "default" : "secondary"}>{member.isActive ? "Activo" : "Inactivo"}</Badge>
                  <Button size="sm" variant="outline" onClick={() => startEdit(member)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDelete(member.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {team.length === 0 && <p className="text-center text-muted-foreground py-4">No hay miembros registrados.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
