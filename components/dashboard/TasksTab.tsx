"use client";

import { useState } from "react";
import { useDashboard, type Task } from "@/lib/store";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AlertCircle, Plus, Trash2, Pencil, CalendarIcon } from "lucide-react";

export function TasksTab() {
  const { tasks, projects, team, addTask, updateTask, deleteTask, settings } = useDashboard();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; msg: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = settings.itemsPerPage || 5;
  const totalPages = Math.ceil(tasks.length / itemsPerPage);
  const paginatedTasks = tasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const [form, setForm] = useState<Omit<Task, "id" | "createdAt">>({
    description: "",
    projectId: "",
    status: "Pendiente",
    priority: "Media",
    userId: "",
    dateline: "",
  });

  const reset = () => {
    setForm({ description: "", projectId: "", status: "Pendiente", priority: "Media", userId: "", dateline: "" });
    setAlert(null);
    setEditingId(null);
    setDateOpen(false);
  };

  const validate = () => {
    if (!form.description.trim()) return "La descripción es obligatoria.";
    if (!form.projectId) return "El proyecto es obligatorio.";
    if (!form.userId) return "El usuario asignado es obligatorio.";
    if (!form.dateline) return "La fecha límite es obligatoria.";
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
      updateTask(editingId, form);
      setAlert({ type: "success", msg: "Tarea actualizada correctamente." });
    } else {
      addTask(form);
      setAlert({ type: "success", msg: "Tarea creada correctamente." });
    }
    setLoading(false);
    setTimeout(() => { setOpen(false); reset(); }, 600);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta tarea?")) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    deleteTask(id);
    if (paginatedTasks.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
    setLoading(false);
  };

  const startEdit = (t: Task) => {
    setEditingId(t.id);
    setForm({
      description: t.description,
      projectId: t.projectId,
      status: t.status,
      priority: t.priority,
      userId: t.userId,
      dateline: t.dateline,
    });
    setAlert(null);
    setOpen(true);
  };

  const statusVariant = (s: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (s) {
      case "Completado": return "default";
      case "En progreso": return "secondary";
      default: return "outline";
    }
  };

  const priorityVariant = (p: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (p) {
      case "Urgente": return "destructive";
      case "Alta": return "default";
      case "Media": return "secondary";
      default: return "outline";
    }
  };

  const selectedDate = form.dateline ? new Date(form.dateline + "T00:00:00") : undefined;

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              text="Anterior"
            />
          </PaginationItem>
          {pages.map((p, idx) =>
            p === "..." ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink isActive={currentPage === p} onClick={() => setCurrentPage(p as number)}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              text="Siguiente"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tareas</h2>
        <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); setOpen(o); }}>
          <DialogTrigger>
            <span className="inline-flex items-center justify-center rounded-lg text-sm font-medium bg-primary text-primary-foreground h-8 px-2.5 gap-1.5 cursor-pointer">
              <Plus className="h-4 w-4" /> Nueva Tarea
            </span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Tarea" : "Crear Tarea"}</DialogTitle>
                <DialogDescription>Administra las tareas de tus proyectos.</DialogDescription>
              </DialogHeader>

              {alert && (
                <Alert variant={alert.type === "error" ? "destructive" : "default"} className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{alert.type === "error" ? "Error" : "Éxito"}</AlertTitle>
                  <AlertDescription>{alert.msg}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Descripción <span className="text-destructive">*</span></Label>
                  <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción de la tarea..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Proyecto <span className="text-destructive">*</span></Label>
                    <Select value={form.projectId} onValueChange={(v) => setForm({ ...form, projectId: v || "" })}>
                      <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                      <SelectContent>
                        {projects.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Asignado a <span className="text-destructive">*</span></Label>
                    <Select value={form.userId} onValueChange={(v) => setForm({ ...form, userId: v || "" })}>
                      <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                      <SelectContent>
                        {team.map((m) => (
                          <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Estado</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Task["status"] })}>
                      <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="En progreso">En progreso</SelectItem>
                        <SelectItem value="Completado">Completado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Prioridad</Label>
                    <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Task["priority"] })}>
                      <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baja">Baja</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Fecha Límite <span className="text-destructive">*</span></Label>
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
                            setForm({ ...form, dateline: format(date, "yyyy-MM-dd") });
                            setDateOpen(false);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setOpen(false); reset(); }}>Cancelar</Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Spinner className="mr-2" />}
                  {editingId ? "Guardar Cambios" : "Crear Tarea"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tareas</CardTitle>
          <CardDescription>Administra todas las tareas de tus proyectos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Tarea</th>
                  <th className="px-4 py-3 text-left font-medium">Proyecto</th>
                  <th className="px-4 py-3 text-left font-medium">Estado</th>
                  <th className="px-4 py-3 text-left font-medium">Prioridad</th>
                  <th className="px-4 py-3 text-left font-medium">Asignado</th>
                  <th className="px-4 py-3 text-left font-medium">Fecha Límite</th>
                  <th className="px-4 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedTasks.map((task) => {
                  const project = projects.find((p) => p.id === task.projectId);
                  const member = team.find((m) => m.id === task.userId);
                  return (
                    <tr key={task.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{task.description}</td>
                      <td className="px-4 py-3">{project?.name || "—"}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                      </td>
                      <td className="px-4 py-3">{member?.name || "—"}</td>
                      <td className="px-4 py-3">{task.dateline}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => startEdit(task)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(task.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paginatedTasks.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No hay tareas registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </CardContent>
      </Card>
    </div>
  );
}
