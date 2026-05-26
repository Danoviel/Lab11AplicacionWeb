"use client";

import { useState } from "react";
import { useDashboard } from "@/lib/store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Plus,
  Trash2,
  Eye,
  AlertTriangle,
  X,
  Users,
} from "lucide-react";

export function ProjectsTab() {
  const { projects, team, addProject, deleteProject } = useDashboard();
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active" as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!formData.name.trim() || !formData.description.trim()) {
      setAlert({ type: "error", message: "Todos los campos son obligatorios" });
      setLoading(false);
      return;
    }

    addProject({
      ...formData,
      startDate: date?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
      endDate: endDate?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
      members: selectedMembers,
    });

    setAlert({ type: "success", message: "Proyecto creado exitosamente" });
    setFormData({ name: "", description: "", status: "active" });
    setSelectedMembers([]);
    setDate(undefined);
    setEndDate(undefined);
    setShowForm(false);
    setLoading(false);

    setTimeout(() => setAlert(null), 3000);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    deleteProject(id);
    setShowDeleteConfirm(null);
    setAlert({ type: "success", message: "Proyecto eliminado exitosamente" });
    setLoading(false);
    setTimeout(() => setAlert(null), 3000);
  };

  const projectDetails = projects.find((p) => p.id === showDetails);

  return (
    <div className="space-y-4">
      {alert && (
        <Alert variant={alert.type === "success" ? "default" : "destructive"}>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Proyectos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo Proyecto
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Crear Proyecto</h3>
            <button
              onClick={() => setShowForm(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del proyecto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Descripción del proyecto"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Fecha Inicio</label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha Fin</label>
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  className="rounded-md border"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Miembros del Equipo
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                {team.map((member) => (
                  <label
                    key={member.userId}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.userId)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMembers([...selectedMembers, member.userId]);
                        } else {
                          setSelectedMembers(
                            selectedMembers.filter((id) => id !== member.userId)
                          );
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span>
                      {member.name} - {member.position}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  Creando...
                </>
              ) : (
                "Crear Proyecto"
              )}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Descripción</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Miembros</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{project.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {project.description}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === "active"
                          ? "bg-green-100 text-green-800"
                          : project.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {project.status === "active"
                        ? "Activo"
                        : project.status === "completed"
                        ? "Completado"
                        : "En espera"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {project.members.length} miembros
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowDetails(project.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(project.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDetails && projectDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{projectDetails.name}</h3>
              <button
                onClick={() => setShowDetails(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <p>
                <span className="font-medium">Descripción:</span>{" "}
                {projectDetails.description}
              </p>
              <p>
                <span className="font-medium">Estado:</span>{" "}
                {projectDetails.status === "active"
                  ? "Activo"
                  : projectDetails.status === "completed"
                  ? "Completado"
                  : "En espera"}
              </p>
              <p>
                <span className="font-medium">Fecha Inicio:</span>{" "}
                {new Date(projectDetails.startDate).toLocaleDateString("es-ES")}
              </p>
              <p>
                <span className="font-medium">Fecha Fin:</span>{" "}
                {new Date(projectDetails.endDate).toLocaleDateString("es-ES")}
              </p>
              <div>
                <span className="font-medium">Miembros:</span>
                <ul className="mt-1 space-y-1">
                  {projectDetails.members.map((memberId) => {
                    const member = team.find((m) => m.userId === memberId);
                    return (
                      <li key={memberId} className="text-sm text-gray-600">
                        {member ? `${member.name} (${member.position})` : memberId}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold">Confirmar Eliminación</h3>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se
              puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    Eliminando...
                  </>
                ) : (
                  "Eliminar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
