"use client";

import { useDashboard } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, CheckCircle2, Clock, Users } from "lucide-react";

export function OverviewTab() {
  const { projects, tasks, team } = useDashboard();

  const totalProjects = projects.length;
  const completedTasks = tasks.filter((t) => t.status === "Completado").length;
  const totalHours = tasks.length * 12 + projects.length * 24;
  const activeMembers = team.filter((m) => m.isActive).length;

  const recentActivity = [
    ...tasks
      .filter((t) => t.status === "Completado")
      .slice(0, 3)
      .map((t) => {
        const member = team.find((m) => m.id === t.userId);
        return {
          user: member?.name || "Usuario",
          action: "completó la tarea",
          task: t.description,
          time: "Reciente",
        };
      }),
    {
      user: "Sistema",
      action: "actualizó métricas del",
      task: "Dashboard",
      time: "Ahora",
    },
  ];

  const stats = [
    {
      title: "Total Proyectos",
      value: totalProjects,
      sub: `+${projects.filter((p) => p.status === "En progreso").length} en progreso`,
      icon: FolderKanban,
    },
    {
      title: "Tareas Completadas",
      value: completedTasks,
      sub: `${Math.round((completedTasks / Math.max(tasks.length, 1)) * 100)}% del total`,
      icon: CheckCircle2,
    },
    {
      title: "Horas Estimadas",
      value: `${totalHours}h`,
      sub: "+12h desde ayer",
      icon: Clock,
    },
    {
      title: "Miembros Activos",
      value: activeMembers,
      sub: `${team.length - activeMembers} inactivos`,
      icon: Users,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Proyectos por Estado</CardTitle>
            <CardDescription>Distribución actual de proyectos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["En progreso", "En revisión", "Planificado", "Completado"].map((status) => {
                const count = projects.filter((p) => p.status === status).length;
                return (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm">{status}</span>
                    <Badge variant={count > 0 ? "default" : "outline"}>{count}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prioridad de Tareas</CardTitle>
            <CardDescription>Tareas agrupadas por prioridad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Urgente", "Alta", "Media", "Baja"].map((priority) => {
                const count = tasks.filter((t) => t.priority === priority).length;
                return (
                  <div key={priority} className="flex items-center justify-between">
                    <span className="text-sm">{priority}</span>
                    <Badge
                      variant={
                        priority === "Urgente"
                          ? "destructive"
                          : priority === "Alta"
                          ? "default"
                          : priority === "Media"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {count}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimas actualizaciones de tus proyectos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{activity.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.action}{" "}
                    <span className="font-medium">{activity.task}</span>
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
