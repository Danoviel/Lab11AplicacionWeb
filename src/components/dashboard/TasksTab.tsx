"use client";

import { useState } from "react";
import { useDashboard, type Task } from "@/lib/store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Pagination } from "@/components/ui/pagination";
import { Calendar } from "@/components/ui/calendar";
import {
  Plus,
  Trash2,
  Pencil,
  X,
  AlertTriangle,
  Flag,
  User,
  FolderKanban,
} from "lucide-react";

export function TasksTab() {
  const { tasks, projects, team, addTask, updateTask, deleteTask, settings } =
    useDashboard();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  const [formData, setFormData] = useState<{
    description: string;
    projectId: string;
    status: Task["status"];
    priority: Task["priority"];
    userId: string;
  }>({
    description: "",
    projectId: "",
    status: "pending",
    priority: "medium",
    userId: "",
  });

  const itemsPerPage = settings.itemsPerPage || 5;
  const totalPages = Math.ceil(tasks.length / itemsPerPage);
  const paginatedTasks = tasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetForm = () => {
    setFormData({
      description: "",
      projectId: "",
      status: "pending",
      priority: "medium",
      userId: "",
    });
    setDeadline(undefined);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!formData.description.trim() || !formData.projectId || !formData.userId) {
      setAlert({
        type: "error",
        message: "Descripción, proyecto y asignado son obligatorios",
      });
      setLoading(false);
      return;
    }

    const taskData = {
      ...formData,
      deadline: deadline?.toISOString().split("T")[0] || "",
    };

    if (editingId) {
      updateTask(editingId, taskData);
      setAlert({ type: "success", message: "Tarea actualizada exitosamente" });
    } else {
      addTask(taskData);
      setAlert({ type: "success", message: "Tarea creada exitosamente" });
    }

    resetForm();
    setShowForm(false);
    setLoading(false);
    setTimeout(() => setAlert(null), 3000);
  };

  const handleEdit = (task: (typeof tasks)[0]) => {
    setFormData({
      description: task.description,
      projectId: task.projectId,
      status: task.status,
      priority: task.priority,
      userId: task.userId,
    });
    setDeadline(task.deadline ? new Date(task.deadline) : undefined);
    setEditingId(task.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    deleteTask(id);
    setShowDeleteConfirm(null);
    setAlert({ type: "success", message: "Tarea eliminada exitosamente" });
    setLoading(false);
    setTimeout(() => setAlert(null), 3000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {alert && (
        <Alert variant={alert.type === "success" ? "default" : "destructive"}>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tareas</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nueva Tarea
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {editingId ? "Editar Tarea" : "Crear Tarea"}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Descripción *</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={3}
                placeholder="Descripción de la tarea"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  <FolderKanban className="inline h-4 w-4 mr-1" />Proyecto *
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) =>
                    setFormData({ ...formData, projectId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Seleccionar proyecto</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  <User className="inline h-4 w-4 mr-1" />Asignado a *
                </label>
                <select
                  value={formData.userId}
                  onChange={(e) =>
                    setFormData({ ...formData, userId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Seleccionar miembro</option>
                  {team.map((member) => (
                    <option key={member.userId} value={member.userId}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as Task["status"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En progreso</option>
                  <option value="completed">Completado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  <Flag className="inline h-4 w-4 mr-1" />Prioridad</label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as Task["priority"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Fecha Límite</label>
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  className="rounded-md border"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  Guardando...
                </>
              ) : editingId ? (
                "Actualizar Tarea"
              ) : (
                "Crear Tarea"
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tarea</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Proyecto</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Asignado</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Prioridad</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Vence</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedTasks.map((task) => {
                const project = projects.find((p) => p.id === task.projectId);
                const member = team.find((m) => m.userId === task.userId);
                return (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{task.description}</td>
                    <td className="px-4 py-3 text-sm">
                      {project ? project.name : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {member ? member.name : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority === "high"
                          ? "Alta"
                          : task.priority === "medium"
                          ? "Media"
                          : "Baja"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status === "completed"
                          ? "Completado"
                          : task.status === "in_progress"
                          ? "En progreso"
                          : "Pendiente"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString("es-ES")
                        : "Sin fecha"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(task.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {tasks.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold">Confirmar Eliminación</h3>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar esta tarea?
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
