"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  progress: number;
  teamIds: string[];
  createdAt: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  role: string;
  name: string;
  email: string;
  position: string;
  birthdate: string;
  phone: string;
  projectId: string | null;
  isActive: boolean;
}

export interface Task {
  id: string;
  description: string;
  projectId: string;
  status: "Pendiente" | "En progreso" | "Completado";
  priority: "Baja" | "Media" | "Alta" | "Urgente";
  userId: string;
  dateline: string;
  createdAt: string;
}

export interface Settings {
  companyName: string;
  adminEmail: string;
  emailNotifications: boolean;
  taskReminders: boolean;
  weeklyReports: boolean;
  darkMode: boolean;
  language: string;
  timezone: string;
  itemsPerPage: number;
}

interface DashboardContextValue {
  projects: Project[];
  team: TeamMember[];
  tasks: Task[];
  settings: Settings;
  addProject: (p: Omit<Project, "id" | "createdAt">) => void;
  updateProject: (id: string, p: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTeamMember: (m: Omit<TeamMember, "id">) => void;
  updateTeamMember: (id: string, m: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  addTask: (t: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, t: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateSettings: (s: Partial<Settings>) => void;
}

const genId = () => Math.random().toString(36).slice(2, 9);

const initialProjects: Project[] = [
  {
    id: "p1",
    name: "E-commerce Platform",
    description: "Plataforma de comercio electrónico con Next.js",
    category: "web",
    priority: "high",
    status: "En progreso",
    progress: 65,
    teamIds: ["t1", "t2"],
    createdAt: "2025-10-01",
  },
  {
    id: "p2",
    name: "Mobile App",
    description: "Aplicación móvil con React Native",
    category: "mobile",
    priority: "medium",
    status: "En revisión",
    progress: 90,
    teamIds: ["t3", "t5"],
    createdAt: "2025-09-15",
  },
  {
    id: "p3",
    name: "Dashboard Analytics",
    description: "Panel de análisis con visualizaciones",
    category: "design",
    priority: "low",
    status: "Planificado",
    progress: 20,
    teamIds: ["t2", "t4"],
    createdAt: "2025-11-01",
  },
  {
    id: "p4",
    name: "API Gateway",
    description: "Microservicios con Node.js",
    category: "web",
    priority: "urgent",
    status: "En progreso",
    progress: 45,
    teamIds: ["t2", "t4", "t5"],
    createdAt: "2025-08-20",
  },
  {
    id: "p5",
    name: "Design System",
    description: "Librería de componentes reutilizables",
    category: "design",
    priority: "medium",
    status: "Completado",
    progress: 100,
    teamIds: ["t3"],
    createdAt: "2025-07-10",
  },
  {
    id: "p6",
    name: "Marketing Website",
    description: "Sitio web institucional",
    category: "marketing",
    priority: "low",
    status: "En progreso",
    progress: 75,
    teamIds: ["t1", "t5"],
    createdAt: "2025-10-20",
  },
];

const initialTeam: TeamMember[] = [
  {
    id: "t1",
    userId: "usr_001",
    role: "Frontend Developer",
    name: "María García",
    email: "maria@example.com",
    position: "Senior Developer",
    birthdate: "1992-03-15",
    phone: "+51 999 111 222",
    projectId: "p1",
    isActive: true,
  },
  {
    id: "t2",
    userId: "usr_002",
    role: "Backend Developer",
    name: "Juan Pérez",
    email: "juan@example.com",
    position: "Tech Lead",
    birthdate: "1988-07-22",
    phone: "+51 999 333 444",
    projectId: "p4",
    isActive: true,
  },
  {
    id: "t3",
    userId: "usr_003",
    role: "UI/UX Designer",
    name: "Ana López",
    email: "ana@example.com",
    position: "Designer Senior",
    birthdate: "1995-11-08",
    phone: "+51 999 555 666",
    projectId: "p2",
    isActive: true,
  },
  {
    id: "t4",
    userId: "usr_004",
    role: "DevOps Engineer",
    name: "Carlos Ruiz",
    email: "carlos@example.com",
    position: "DevOps Lead",
    birthdate: "1990-01-30",
    phone: "+51 999 777 888",
    projectId: "p3",
    isActive: true,
  },
  {
    id: "t5",
    userId: "usr_005",
    role: "Project Manager",
    name: "Laura Martínez",
    email: "laura@example.com",
    position: "PM Senior",
    birthdate: "1987-05-12",
    phone: "+51 999 999 000",
    projectId: "p2",
    isActive: true,
  },
  {
    id: "t6",
    userId: "usr_006",
    role: "QA Engineer",
    name: "Pedro Sánchez",
    email: "pedro@example.com",
    position: "QA Senior",
    birthdate: "1993-09-05",
    phone: "+51 999 123 456",
    projectId: null,
    isActive: false,
  },
];

const initialTasks: Task[] = [
  {
    id: "tk1",
    description: "Implementar autenticación JWT",
    projectId: "p1",
    status: "En progreso",
    priority: "Alta",
    userId: "t2",
    dateline: "2025-11-15",
    createdAt: "2025-10-25",
  },
  {
    id: "tk2",
    description: "Diseñar pantalla de perfil de usuario",
    projectId: "p2",
    status: "Pendiente",
    priority: "Media",
    userId: "t3",
    dateline: "2025-11-20",
    createdAt: "2025-10-26",
  },
  {
    id: "tk3",
    description: "Configurar pipeline CI/CD",
    projectId: "p4",
    status: "Completado",
    priority: "Alta",
    userId: "t4",
    dateline: "2025-11-10",
    createdAt: "2025-10-20",
  },
  {
    id: "tk4",
    description: "Optimizar queries SQL del dashboard",
    projectId: "p1",
    status: "En progreso",
    priority: "Urgente",
    userId: "t2",
    dateline: "2025-11-12",
    createdAt: "2025-10-28",
  },
  {
    id: "tk5",
    description: "Documentar API endpoints v2",
    projectId: "p4",
    status: "Pendiente",
    priority: "Baja",
    userId: "t5",
    dateline: "2025-11-25",
    createdAt: "2025-10-29",
  },
  {
    id: "tk6",
    description: "Crear componentes base en Storybook",
    projectId: "p5",
    status: "Completado",
    priority: "Media",
    userId: "t3",
    dateline: "2025-10-30",
    createdAt: "2025-10-15",
  },
  {
    id: "tk7",
    description: "Integrar pasarela de pagos",
    projectId: "p1",
    status: "Pendiente",
    priority: "Alta",
    userId: "t1",
    dateline: "2025-11-18",
    createdAt: "2025-10-30",
  },
  {
    id: "tk8",
    description: "Configurar nginx y SSL",
    projectId: "p4",
    status: "En progreso",
    priority: "Media",
    userId: "t4",
    dateline: "2025-11-22",
    createdAt: "2025-10-27",
  },
  {
    id: "tk9",
    description: "Reuniones de planificación semanal",
    projectId: "p6",
    status: "Pendiente",
    priority: "Baja",
    userId: "t5",
    dateline: "2025-11-30",
    createdAt: "2025-10-31",
  },
  {
    id: "tk10",
    description: "Implementar dark mode en landing",
    projectId: "p6",
    status: "En progreso",
    priority: "Media",
    userId: "t1",
    dateline: "2025-11-14",
    createdAt: "2025-10-28",
  },
  {
    id: "tk11",
    description: "Auditoría de seguridad",
    projectId: "p4",
    status: "Pendiente",
    priority: "Urgente",
    userId: "t2",
    dateline: "2025-11-08",
    createdAt: "2025-11-01",
  },
  {
    id: "tk12",
    description: "Migrar base de datos a PostgreSQL",
    projectId: "p3",
    status: "Pendiente",
    priority: "Alta",
    userId: "t2",
    dateline: "2025-12-05",
    createdAt: "2025-11-02",
  },
];

const initialSettings: Settings = {
  companyName: "Lab11 Technologies",
  adminEmail: "admin@lab11.dev",
  emailNotifications: true,
  taskReminders: true,
  weeklyReports: false,
  darkMode: false,
  language: "es",
  timezone: "America/Lima",
  itemsPerPage: 5,
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [settings, setSettings] = useState<Settings>(initialSettings);

  const addProject = (p: Omit<Project, "id" | "createdAt">) => {
    const newProject: Project = {
      ...p,
      id: genId(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const updateProject = (id: string, p: Partial<Project>) => {
    setProjects((prev) => prev.map((proj) => (proj.id === id ? { ...proj, ...p } : proj)));
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((proj) => proj.id !== id));
    setTasks((prev) => prev.filter((task) => task.projectId !== id));
    setTeam((prev) =>
      prev.map((member) => (member.projectId === id ? { ...member, projectId: null } : member))
    );
  };

  const addTeamMember = (m: Omit<TeamMember, "id">) => {
    const newMember: TeamMember = { ...m, id: genId() };
    setTeam((prev) => [...prev, newMember]);
  };

  const updateTeamMember = (id: string, m: Partial<TeamMember>) => {
    setTeam((prev) => prev.map((member) => (member.id === id ? { ...member, ...m } : member)));
  };

  const deleteTeamMember = (id: string) => {
    setTeam((prev) => prev.filter((member) => member.id !== id));
    setProjects((prev) =>
      prev.map((proj) => ({
        ...proj,
        teamIds: proj.teamIds.filter((tid) => tid !== id),
      }))
    );
    setTasks((prev) =>
      prev.map((task) => (task.userId === id ? { ...task, userId: "" } : task))
    );
  };

  const addTask = (t: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...t,
      id: genId(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, t: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...t } : task)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const updateSettings = (s: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...s }));
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
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
