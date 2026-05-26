"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "on_hold";
  startDate: string;
  endDate: string;
  members: string[];
}

export interface TeamMember {
  userId: string;
  role: string;
  name: string;
  email: string;
  position: string;
  birthdate: string;
  phone: string;
  projectId: string;
  isActive: boolean;
}

export interface Task {
  id: string;
  description: string;
  projectId: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  userId: string;
  deadline: string;
}

export interface AppSettings {
  companyName: string;
  email: string;
  phone: string;
  timezone: string;
  language: string;
  notifications: boolean;
  darkMode: boolean;
  itemsPerPage: number;
}

interface DashboardContextType {
  projects: Project[];
  team: TeamMember[];
  tasks: Task[];
  settings: AppSettings;
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTeamMember: (member: Omit<TeamMember, "userId">) => void;
  updateTeamMember: (userId: string, member: Partial<TeamMember>) => void;
  deleteTeamMember: (userId: string) => void;
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Rediseño completo del sitio web corporativo",
    status: "active",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    members: ["user1", "user2"],
  },
  {
    id: "2",
    name: "Mobile App",
    description: "Desarrollo de aplicación móvil para iOS y Android",
    status: "active",
    startDate: "2024-02-01",
    endDate: "2024-08-15",
    members: ["user3", "user4"],
  },
  {
    id: "3",
    name: "API Integration",
    description: "Integración con APIs de terceros",
    status: "on_hold",
    startDate: "2024-03-01",
    endDate: "2024-05-30",
    members: ["user1"],
  },
];

const initialTeam: TeamMember[] = [
  {
    userId: "user1",
    role: "Desarrollador Senior",
    name: "Ana García",
    email: "ana.garcia@empresa.com",
    position: "Frontend Developer",
    birthdate: "1990-05-15",
    phone: "+51 999 111 222",
    projectId: "1",
    isActive: true,
  },
  {
    userId: "user2",
    role: "Diseñador UX/UI",
    name: "Carlos López",
    email: "carlos.lopez@empresa.com",
    position: "UX Designer",
    birthdate: "1988-11-22",
    phone: "+51 999 333 444",
    projectId: "1",
    isActive: true,
  },
  {
    userId: "user3",
    role: "Desarrollador Backend",
    name: "María Rodríguez",
    email: "maria.rodriguez@empresa.com",
    position: "Backend Developer",
    birthdate: "1992-03-08",
    phone: "+51 999 555 666",
    projectId: "2",
    isActive: true,
  },
  {
    userId: "user4",
    role: "DevOps Engineer",
    name: "Juan Martínez",
    email: "juan.martinez@empresa.com",
    position: "DevOps",
    birthdate: "1985-09-18",
    phone: "+51 999 777 888",
    projectId: "2",
    isActive: true,
  },
];

const initialTasks: Task[] = [
  {
    id: "task1",
    description: "Diseñar mockups de la landing page",
    projectId: "1",
    status: "completed",
    priority: "high",
    userId: "user2",
    deadline: "2024-02-15",
  },
  {
    id: "task2",
    description: "Implementar autenticación con JWT",
    projectId: "1",
    status: "in_progress",
    priority: "high",
    userId: "user1",
    deadline: "2024-03-30",
  },
  {
    id: "task3",
    description: "Escribir tests unitarios",
    projectId: "1",
    status: "pending",
    priority: "medium",
    userId: "user1",
    deadline: "2024-04-15",
  },
  {
    id: "task4",
    description: "Documentar API REST",
    projectId: "3",
    status: "pending",
    priority: "low",
    userId: "user3",
    deadline: "2024-05-01",
  },
  {
    id: "task5",
    description: "Configurar CI/CD pipeline",
    projectId: "2",
    status: "in_progress",
    priority: "high",
    userId: "user4",
    deadline: "2024-04-30",
  },
  {
    id: "task6",
    description: "Optimizar queries de base de datos",
    projectId: "2",
    status: "pending",
    priority: "medium",
    userId: "user3",
    deadline: "2024-05-15",
  },
];

const initialSettings: AppSettings = {
  companyName: "Mi Empresa",
  email: "contacto@empresa.com",
  phone: "+51 1 234 5678",
  timezone: "America/Lima",
  language: "es",
  notifications: true,
  darkMode: false,
  itemsPerPage: 5,
};

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);

  const addProject = (project: Omit<Project, "id">) => {
    const newProject = { ...project, id: `proj_${Date.now()}` };
    setProjects((prev) => [...prev, newProject]);
  };

  const updateProject = (id: string, project: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...project } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const addTeamMember = (member: Omit<TeamMember, "userId">) => {
    const newMember = { ...member, userId: `user_${Date.now()}` };
    setTeam((prev) => [...prev, newMember]);
  };

  const updateTeamMember = (userId: string, member: Partial<TeamMember>) => {
    setTeam((prev) =>
      prev.map((m) => (m.userId === userId ? { ...m, ...member } : m))
    );
  };

  const deleteTeamMember = (userId: string) => {
    setTeam((prev) => prev.filter((m) => m.userId !== userId));
  };

  const addTask = (task: Omit<Task, "id">) => {
    const newTask = { ...task, id: `task_${Date.now()}` };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, task: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...task } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <DashboardContext.Provider
      value={{
        projects,
        team,
        tasks,
        settings,
        addProject,
        updateProject,
        deleteProject,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        addTask,
        updateTask,
        deleteTask,
        updateSettings,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
