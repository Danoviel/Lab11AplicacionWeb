"use client";

import { useDashboard } from "@/lib/store";
import { FolderKanban, Users, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export function OverviewTab() {
  const { projects, team, tasks } = useDashboard();

  const activeProjects = projects.filter((p) => p.status === "active").length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const activeTeamMembers = team.filter((m) => m.isActive).length;

  const stats = [
    {
      title: "Proyectos Activos",
      value: activeProjects,
      icon: FolderKanban,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Miembros Activos",
      value: activeTeamMembers,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Tareas Completadas",
      value: completedTasks,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Tareas Pendientes",
      value: pendingTasks,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "En Progreso",
      value: inProgressTasks,
      icon: AlertCircle,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-3xl font-bold mt-2 ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Proyectos Recientes</h3>
          <div className="space-y-3">
            {projects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-gray-500">{project.description}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
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
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Tareas Prioritarias</h3>
          <div className="space-y-3">
            {tasks
              .filter((t) => t.priority === "high")
              .slice(0, 3)
              .map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{task.description}</p>
                    <p className="text-sm text-gray-500">
                      Vence: {new Date(task.deadline).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : task.status === "in_progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {task.status === "completed"
                      ? "Completado"
                      : task.status === "in_progress"
                      ? "En progreso"
                      : "Pendiente"}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
