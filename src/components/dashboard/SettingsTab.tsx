"use client";

import { useState } from "react";
import { useDashboard } from "@/lib/store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import {
  Save,
  Bell,
  Moon,
  Globe,
  Building2,
  Mail,
  Phone,
  Clock,
  ListFilter,
} from "lucide-react";

export function SettingsTab() {
  const { settings, updateSettings } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [formData, setFormData] = useState(settings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    updateSettings(formData);
    setAlert({ type: "success", message: "Configuración guardada exitosamente" });
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

      <h2 className="text-2xl font-bold">Configuración</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Información de la Empresa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre de la Empresa</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <Mail className="inline h-4 w-4 mr-1" />Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <Phone className="inline h-4 w-4 mr-1" />Teléfono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <Clock className="inline h-4 w-4 mr-1" />Zona Horaria
              </label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="America/Lima">América/Lima (GMT-5)</option>
                <option value="America/Mexico_City">América/México (GMT-6)</option>
                <option value="America/Bogota">América/Bogotá (GMT-5)</option>
                <option value="America/Santiago">América/Santiago (GMT-4)</option>
                <option value="America/Buenos_Aires">América/Buenos Aires (GMT-3)</option>
                <option value="Europe/Madrid">Europa/Madrid (GMT+1)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Preferencias
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Idioma</label>
              <select
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <ListFilter className="inline h-4 w-4 mr-1" />Items por página
              </label>
              <select
                value={formData.itemsPerPage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    itemsPerPage: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones y Tema
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">Notificaciones</p>
                  <p className="text-sm text-gray-500">Recibir notificaciones por email</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, notifications: !formData.notifications })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.notifications ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.notifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">Tema Oscuro</p>
                  <p className="text-sm text-gray-500">Activar modo oscuro</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, darkMode: !formData.darkMode })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.darkMode ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.darkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Guardar Configuración
            </>
          )}
        </button>
      </form>
    </div>
  );
}
