"use client";

import { useState } from "react";
import { useDashboard, type Project } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, Plus, Trash2, Eye, Pencil, Users } from "lucide-react";

export function ProjectsTab() {
  const { projects, team, addProject, updateProject, deleteProject } = useDashboard();
  const [openCreate, setOpenCreate] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; msg: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    priority: "",
    status: "En progreso",
    progress: 0,
    teamIds: [] as string[],
  });

  const resetForm = () => {
    setForm({ name: "", description: "", category: "", priority: "", status: "En progreso", progress: 0, teamIds: [] });
    setAlert(null);
    setEditingId(null);
  };

  const validate = () => {
    if (!form.name.trim()) return "El nombre del proyecto es obligatorio.";
    if (!form.category) return "La categoría es obligatoria.";
    if (!form.priority) return "La prioridad es obligatoria.";
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
      updateProject(editingId, { ...form, progress: Number(form.progress) });
      setAlert({ type: "success", msg: "Proyecto actualizado correctamente." });
    } else {
      addProject({ ...form, progress: Number(form.progress) });
      setAlert({ type: "success", msg: "Proyecto creado correctamente." });
    }
    setLoading(false);
    setTimeout(() => {
      setOpenCreate(false);
      resetForm();
    }, 600);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este proyecto? Se eliminarán también las tareas asociadas.")) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    deleteProject(id);
    setLoading(false);
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      name: project.name,
      description: project.description,
      category: project.category,
      priority: project.priority,
      status: project.status,
      progress: project.progress,
      teamIds: project.teamIds,
    });
    setAlert(null);
    setOpenCreate(true);
  };

  const openDetails = (project: Project) => {
    setDetailProject(project);
    setOpenDetail(true);
  };

  const statusBadge = (status: string) => {
    const map: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      Completado: "default",
      "En revisión": "secondary",
      Planificado: "outline",
      "En progreso": "secondary",
    };
    return map[status] || "outline";
  };

  const priorityBadge = (p: string) => {
    const map: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      Urgente: "destructive",
      Alta: "default",
      Media: "secondary",
      Baja: "outline",
    };
    return map[p] || "outline";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Proyectos</h2>
        <Dialog open={openCreate} onOpenChange={(o) => { if (!o) resetForm(); setOpenCreate(o); }}>
          <DialogTrigger>
            <span className="inline-flex items-center justify-center rounded-lg text-sm font-medium bg-primary text-primary-foreground h-8 px-2.5 gap-1.5 cursor-pointer">
              <Plus className="h-4 w-4" /> Nuevo Proyecto
            </span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Proyecto" : "Crear Nuevo Proyecto"}</DialogTitle>
                <DialogDescription>Completa la información del proyecto.</DialogDescription>
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
                  <Label>Nombre <span className="text-destructive">*</span></Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Mi Proyecto" />
                </div>
                <div className="grid gap-2">
                  <Label>Descripción</Label>
                  <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Breve descripción..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Categoría <span className="text-destructive">*</span></Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v || "" })}>
                      <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web">Desarrollo Web</SelectItem>
                        <SelectItem value="mobile">Desarrollo Mobile</SelectItem>
                        <SelectItem value="design">Diseño</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Prioridad <span className="text-destructive">*</span></Label>
                    <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v || "" })}>
                      <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Estado</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v || "" })}>
                      <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planificado">Planificado</SelectItem>
                        <SelectItem value="En progreso">En progreso</SelectItem>
                        <SelectItem value="En revisión">En revisión</SelectItem>
                        <SelectItem value="Completado">Completado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Progreso (%)</Label>
                    <Input type="number" min={0} max={100} value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Miembros del Equipo</Label>
                  <div className="flex flex-wrap gap-2 border rounded-lg p-2">
                    {team.map((m) => (
                      <label key={m.id} className="flex items-center gap-1 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={form.teamIds.includes(m.id)}
                          onChange={(e) => {
                            const ids = e.target.checked
                              ? [...form.teamIds, m.id]
                              : form.teamIds.filter((id) => id !== m.id);
                            setForm({ ...form, teamIds: ids });
                          }}
                        />
                        {m.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setOpenCreate(false); resetForm(); }}>Cancelar</Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Spinner className="mr-2" />}
                  {editingId ? "Guardar Cambios" : "Crear Proyecto"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <Badge variant={statusBadge(project.status)}>{project.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {project.teamIds.length} miembros
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openDetails(project)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => startEdit(project)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(project.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">No hay proyectos. Crea uno nuevo.</CardContent>
        </Card>
      )}

      <Dialog open={openDetail} onOpenChange={setOpenDetail}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{detailProject?.name}</DialogTitle>
            <DialogDescription>{detailProject?.description}</DialogDescription>
          </DialogHeader>
          {detailProject && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Categoría</Label>
                  <p className="font-medium capitalize">{detailProject.category}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Prioridad</Label>
                  <Badge variant={priorityBadge(detailProject.priority)}>{detailProject.priority}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Estado</Label>
                  <Badge variant={statusBadge(detailProject.status)}>{detailProject.status}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Progreso</Label>
                  <p className="font-medium">{detailProject.progress}%</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Miembros Asignados</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {detailProject.teamIds.length === 0 && <span className="text-sm text-muted-foreground">Sin miembros asignados</span>}
                  {detailProject.teamIds.map((tid) => {
                    const m = team.find((x) => x.id === tid);
                    return m ? (
                      <Badge key={tid} variant="secondary">{m.name}</Badge>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setOpenDetail(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
