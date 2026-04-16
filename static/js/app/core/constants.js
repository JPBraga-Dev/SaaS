export const STORAGE_KEY = "studio-panel-state-v4";

export const TABS = [
  { id: "overview", label: "Visão Geral", fixed: true },
  { id: "triggers", label: "Triggers" },
  { id: "webhooks", label: "Webhooks" },
  { id: "logs", label: "Logs" },
  { id: "apiKeys", label: "API Keys" },
  { id: "envVars", label: "Variáveis de Ambiente" },
  { id: "schedules", label: "Agendamentos" },
  { id: "team", label: "Equipe" },
  { id: "docs", label: "Documentação" },
  { id: "metrics", label: "Métricas" },
  { id: "settings", label: "Configurações", fixed: true }
];

export const ICONS = {
  dashboard: '<path d="M4 5.5h6v6H4zM14 5.5h6v10h-6zM4 15.5h6v4H4zM14 17.5h6v2h-6z"/>',
  projects: '<path d="M4 7.5h16M4 12h16M4 16.5h10"/>',
  settings: '<path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/><path d="M19.4 13.5a1 1 0 0 0 .2 1.1l.1.1a1 1 0 0 1 0 1.4l-1.2 1.2a1 1 0 0 1-1.4 0l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V19a1 1 0 0 1-1 1h-1.8a1 1 0 0 1-1-1v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1 1 0 0 1-1.4 0L4.2 16a1 1 0 0 1 0-1.4l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H3.4a1 1 0 0 1-1-1v-1.8a1 1 0 0 1 1-1h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1 1 0 0 1 0-1.4L5.4 4.6a1 1 0 0 1 1.4 0l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V3.8a1 1 0 0 1 1-1h1.8a1 1 0 0 1 1 1V4a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1 1 0 0 1 1.4 0L19.8 6a1 1 0 0 1 0 1.4l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.2a1 1 0 0 1 1 1v1.8a1 1 0 0 1-1 1h-.2a1 1 0 0 0-.9.6Z"/>',
  theme: '<path d="M12 3.5v2.2M12 18.3v2.2M5.7 5.7l1.6 1.6M16.7 16.7l1.6 1.6M3.5 12h2.2M18.3 12h2.2M5.7 18.3l1.6-1.6M16.7 7.3l1.6-1.6"/><circle cx="12" cy="12" r="3.8"/>',
  bolt: '<path d="m13 2-8 11h6l-1 9 8-11h-6l1-9Z"/>',
  link: '<path d="M10.5 13.5 13.5 10.5M8 15a4 4 0 0 1 0-6l2-2a4 4 0 0 1 6 0M16 9a4 4 0 0 1 0 6l-2 2a4 4 0 0 1-6 0"/>',
  sync: '<path d="M20 6v5h-5M4 18v-5h5"/><path d="M5.5 10a7 7 0 0 1 12-2M18.5 14a7 7 0 0 1-12 2"/>',
  db: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v8c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/>'
};

export const DEFAULT_STATE = {
  auth: { ok: false, username: "", role: "Admin", email: "jp@studio.local" },
  page: "dashboard",
  sidebarOpen: false,
  focusMode: false,
  notifyOpen: false,
  dropdownOpen: false,
  filters: { search: "", status: "all" },
  settings: {
    systemName: "Studio Panel",
    theme: "dark",
    language: "pt",
    timezone: "America/Fortaleza",
    dateFormat: "DD/MM/AAAA",
    numberFormat: "1.000,00",
    radius: "suave",
    notifications: { system: true, projects: true, security: true }
  },
  shortcuts: {
    dashboard: "d",
    projects: "p",
    search: "ctrl+k",
    focus: "ctrl+shift+f",
    sidebar: "[",
    tabs: "1-9"
  },
  sidebarItems: [
    { id: "dashboard", label: "Início", icon: "dashboard", visible: true, separatorBefore: false, slot: "main", page: "dashboard" },
    { id: "projects", label: "Projetos", icon: "projects", visible: true, separatorBefore: false, slot: "main", page: "projects" },
    { id: "global", label: "Configurações", icon: "settings", visible: true, separatorBefore: true, slot: "main", page: "system-settings" },
    { id: "theme", label: "Tema", icon: "theme", visible: true, separatorBefore: false, slot: "foot", action: "theme" }
  ],
  notifications: [
    { id: "n1", text: "Webhook validado em AutoFlow", time: "agora", read: false },
    { id: "n2", text: "Nova chave API criada em ConnectHub", time: "2 min", read: false },
    { id: "n3", text: "TaskSync retomou sincronização", time: "8 min", read: true }
  ],
  currentProjectId: "autoflow",
  currentTabByProject: {},
  projectOrder: ["autoflow", "connecthub", "tasksync", "databridge"],
  projects: [
    { id: "autoflow", name: "AutoFlow", status: "Ativo", description: "Automação de fluxos e integrações em tempo real.", color: "#7c7c80", icon: "bolt", pinned: true, archived: false, modules: { triggers: true, webhooks: true, logs: true, apiKeys: false, envVars: true, schedules: true, team: true, docs: false, metrics: true } },
    { id: "connecthub", name: "ConnectHub", status: "Ativo", description: "Orquestração central de conectores e roteamento.", color: "#65656a", icon: "link", pinned: false, archived: false, modules: { triggers: true, webhooks: true, logs: true, apiKeys: true, envVars: true, schedules: false, team: false, docs: true, metrics: true } },
    { id: "tasksync", name: "TaskSync", status: "Pausado", description: "Sincronização de tarefas entre serviços e times.", color: "#5d5d62", icon: "sync", pinned: false, archived: false, modules: { triggers: true, webhooks: false, logs: true, apiKeys: false, envVars: true, schedules: true, team: true, docs: false, metrics: false } },
    { id: "databridge", name: "DataBridge", status: "Inativo", description: "Ponte de dados para ingestão e transformação.", color: "#54545a", icon: "db", pinned: false, archived: false, modules: { triggers: false, webhooks: false, logs: true, apiKeys: true, envVars: true, schedules: false, team: false, docs: true, metrics: true } }
  ]
};
