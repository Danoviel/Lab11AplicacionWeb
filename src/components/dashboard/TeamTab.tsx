"use client";

import { useState } from "react";
import { useDashboard } from "@/lib/store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Calendar } from "@/components/ui/calendar";
import {
  Plus,
  Trash2,
  Pencil,
  X,
  AlertTriangle,
  Mail,
  Phone,
  Briefcase,
  User,
} from "lucide-react";

export function TeamTab() {
  const { team, projects, addTeamMember, updateTeamMember, deleteTeamMember } =
    useDashboard();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    position: "",
    phone: "",
    projectId: "",
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "",
      position: "",
      phone: "",
      projectId: "",
      isActive: true,
    });
    setBirthdate(undefined);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.role.trim() ||
      !formData.position.trim()
    ) {
      setAlert({ type: "error", message: "Los campos obligatorios deben estar completos" });
      setLoading(false);
      return;
    }

    const memberData = {
      ...formData,
      birthdate: birthdate?.toISOString().split("T")[0] || "",
    };

    if (editingId) {
      updateTeamMember(editingId, memberData);
      setAlert({ type: "success", message: "Miembro actualizado exitosamente" });
    } else {
      addTeamMember(memberData);
      setAlert({ type: "success", message: "Miembro creado exitosamente" });
    }

    resetForm();
    setShowForm(false);
    setLoading(false);
    setTimeout(() => setAlert(null), 3000);
  };

  const handleEdit = (member: (typeof team)[0]) => {
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      position: member.position,
      phone: member.phone,
      projectId: member.projectId,
      isActive: member.isActive,
    });
    setBirthdate(member.birthdate ? new Date(member.birthdate) : undefined);
    setEditingId(member.userId);
    setShowForm(true);
  };

  const handleDelete = async (userId: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    deleteTeamMember(userId);
    setShowDeleteConfirm(null);
    setAlert({ type: "success", message: "Miembro eliminado exitosamente" });
    setLoading(false);
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className="space-y-4">
      {alert && (
        <Alert variant={alert.type === "success" ? "default" : "destructive"}>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Equipo</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo Miembro
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {editingId ? "Editar Miembro" : "Crear Miembro"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  <User className="inline h-4 w-4 mr-1" />Nombre *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nombre completo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  <Mail className="inline h-4 w-4 mr-1" />Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="correo@empresa.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rol *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: Desarrollador Senior"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  <Briefcase className="inline h-4 w-4 mr-1" />Posición *</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: Frontend Developer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  <Phone className="inline h-4 w-4 mr-1" />Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="+51 999 999 999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Proyecto Asignado</label>
                <select
                  value={formData.projectId}
                  onChange={(e) =>
                    setFormData({ ...formData, projectId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Sin proyecto</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fecha Nacimiento</label>
                <Calendar
                  mode="single"
                  selected={birthdate}
                  onSelect={setBirthdate}
                  className="rounded-md border"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="rounded border-gray-300 h-4 w-4"
                  />
                  <span className="text-sm">Activo</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  Guardando...
                </>
              ) : editingId ? (
                "Actualizar Miembro"
              ) : (
                "Crear Miembro"
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rol</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Posición</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Proyecto</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estado</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {team.map((member) => {
                const project = projects.find((p) => p.id === member.projectId);
                return (
                  <tr key={member.userId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{member.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{member.email}</td>
                    <td className="px-4 py-3 text-sm">{member.role}</td>
                    <td className="px-4 py-3 text-sm">{member.position}</td>
                    <td className="px-4 py-3 text-sm">
                      {project ? project.name : "Sin proyecto"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          member.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {member.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(member.userId)}
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

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold">Confirmar Eliminación</h3>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar este miembro del equipo?
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
