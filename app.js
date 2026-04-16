(() => {
  const STORAGE_KEY = "studio-panel-state-v4";
  const TABS = [
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

  const ICONS = {
    dashboard: '<path d="M4 5.5h6v6H4zM14 5.5h6v10h-6zM4 15.5h6v4H4zM14 17.5h6v2h-6z"/>',
    projects: '<path d="M4 7.5h16M4 12h16M4 16.5h10"/>',
    settings: '<path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/><path d="M19.4 13.5a1 1 0 0 0 .2 1.1l.1.1a1 1 0 0 1 0 1.4l-1.2 1.2a1 1 0 0 1-1.4 0l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V19a1 1 0 0 1-1 1h-1.8a1 1 0 0 1-1-1v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1 1 0 0 1-1.4 0L4.2 16a1 1 0 0 1 0-1.4l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H3.4a1 1 0 0 1-1-1v-1.8a1 1 0 0 1 1-1h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1 1 0 0 1 0-1.4L5.4 4.6a1 1 0 0 1 1.4 0l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V3.8a1 1 0 0 1 1-1h1.8a1 1 0 0 1 1 1V4a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1 1 0 0 1 1.4 0L19.8 6a1 1 0 0 1 0 1.4l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.2a1 1 0 0 1 1 1v1.8a1 1 0 0 1-1 1h-.2a1 1 0 0 0-.9.6Z"/>',
    theme: '<path d="M12 3.5v2.2M12 18.3v2.2M5.7 5.7l1.6 1.6M16.7 16.7l1.6 1.6M3.5 12h2.2M18.3 12h2.2M5.7 18.3l1.6-1.6M16.7 7.3l1.6-1.6"/><circle cx="12" cy="12" r="3.8"/>',
    bolt: '<path d="m13 2-8 11h6l-1 9 8-11h-6l1-9Z"/>',
    link: '<path d="M10.5 13.5 13.5 10.5M8 15a4 4 0 0 1 0-6l2-2a4 4 0 0 1 6 0M16 9a4 4 0 0 1 0 6l-2 2a4 4 0 0 1-6 0"/>',
    sync: '<path d="M20 6v5h-5M4 18v-5h5"/><path d="M5.5 10a7 7 0 0 1 12-2M18.5 14a7 7 0 0 1-12 2"/>',
    db: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v8c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/>'
  };

  const defaultState = {
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

  const S = loadState();
  const PAGES = {
    dashboard: document.getElementById("page-dashboard"),
    projects: document.getElementById("page-projects"),
    "project-detail": document.getElementById("page-project-detail"),
    "system-settings": document.getElementById("page-system-settings"),
    profile: document.getElementById("page-profile")
  };

  const E = {
    authShell: document.getElementById("auth-shell"),
    loginUser: document.getElementById("login-user"),
    loginPass: document.getElementById("login-pass"),
    loginSubmit: document.getElementById("login-submit"),
    loginError: document.getElementById("login-error"),
    headerTitle: document.getElementById("header-title"),
    globalSearch: document.getElementById("global-search"),
    projectsFilterButton: document.getElementById("projects-filter-button"),
    projectsSearch: document.getElementById("projects-search"),
    sidebarMainNav: document.getElementById("sidebar-main-nav"),
    sidebarFootNav: document.getElementById("sidebar-foot-nav"),
    sidebarToggle: document.querySelector("[data-sidebar-toggle]"),
    projectList: document.getElementById("project-list"),
    projectName: document.getElementById("project-name"),
    projectStatus: document.getElementById("project-status"),
    projectDescription: document.getElementById("project-description"),
    projectTabs: document.getElementById("project-tabs"),
    projectTabPanels: document.getElementById("project-tab-panels"),
    systemSettingsContent: document.getElementById("system-settings-content"),
    profileContent: document.getElementById("profile-content"),
    focusToggle: document.getElementById("focus-toggle"),
    focusExit: document.getElementById("focus-exit"),
    toastStack: document.getElementById("toast-stack"),
    notifyButton: document.getElementById("notify-button"),
    notifyBadge: document.getElementById("notify-badge"),
    notifyPanel: document.getElementById("notify-panel"),
    notifyOverlay: document.getElementById("notify-overlay"),
    notifyList: document.getElementById("notify-list"),
    userMenuButton: document.getElementById("user-menu-button"),
    userDropdown: document.getElementById("user-dropdown"),
    avatarMini: document.getElementById("avatar-mini"),
    userName: document.getElementById("user-name"),
    userRole: document.getElementById("user-role"),
    openProfile: document.getElementById("open-profile"),
    logoutButton: document.getElementById("logout-button"),
    kpiProjects: document.getElementById("kpi-projects"),
    kpiTriggers: document.getElementById("kpi-triggers"),
    kpiIntegrations: document.getElementById("kpi-integrations")
  };

  let shortcutCapture = null;
  let draggingProject = null;
  let draggingSidebar = null;

  function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return structuredClone(defaultState);
    try {
      const parsed = JSON.parse(saved);
      const merged = structuredClone(defaultState);
      Object.assign(merged, parsed);
      merged.settings = { ...defaultState.settings, ...(parsed.settings || {}) };
      merged.settings.notifications = { ...defaultState.settings.notifications, ...((parsed.settings || {}).notifications || {}) };
      merged.filters = { ...defaultState.filters, ...(parsed.filters || {}) };
      merged.auth = { ...defaultState.auth, ...(parsed.auth || {}) };
      return merged;
    } catch {
      return structuredClone(defaultState);
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(S));
  }

  function icon(key) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">${ICONS[key] || ICONS.dashboard}</svg>`;
  }

  function toast(message) {
    const node = document.createElement("div");
    node.className = "toast";
    node.textContent = message;
    E.toastStack.appendChild(node);
    setTimeout(() => {
      node.style.opacity = "0";
      setTimeout(() => node.remove(), 220);
    }, 3000);
  }

  function applyTheme() {
    document.body.classList.toggle("dark-mode", S.settings.theme === "dark");
  }

  function applyRadius() {
    document.body.classList.remove("radius-recto", "radius-suave", "radius-arredondado");
    document.body.classList.add(`radius-${S.settings.radius}`);
  }

  function applySidebar() {
    document.body.classList.toggle("sidebar-open", S.sidebarOpen);
    E.sidebarToggle?.setAttribute("aria-expanded", String(S.sidebarOpen));
  }

  function applyFocus() {
    document.body.classList.toggle("focus-mode", S.focusMode);
  }

  function applyAuth() {
    document.body.classList.toggle("authenticated", S.auth.ok);
  }

  function setActivePage(page) {
    S.page = page;
    Object.entries(PAGES).forEach(([key, el]) => el?.classList.toggle("active", key === page));
    E.headerTitle.textContent = page === "projects" ? "Projetos" : page === "project-detail" ? "Projeto" : page === "system-settings" ? "Configurações" : page === "profile" ? "Perfil" : "Painel";
    renderSidebar();
    save();
  }

  function statusClass(status) {
    if (status === "Ativo") return "active";
    if (status === "Pausado") return "paused";
    return "inactive";
  }

  function getProject(id) {
    return S.projects.find((p) => p.id === id);
  }

  function orderIndex(id) {
    const i = S.projectOrder.indexOf(id);
    return i >= 0 ? i : 999;
  }

  function move(array, from, to) {
    if (from < 0 || to < 0 || from >= array.length || to >= array.length) return array;
    const copy = [...array];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    return copy;
  }
  function renderSidebar() {
    const make = (item, active) => item.visible ? `<button class="nav-item ${active ? "active" : ""}" type="button" title="${item.label}" data-sidebar-item="${item.id}">${icon(item.icon)}<span>${item.label}</span></button>` : "";
    const build = (items) => items.map((item, idx) => `${item.separatorBefore && idx > 0 ? '<div class="nav-separator"></div>' : ""}${make(item, item.page === S.page)}`).join("");
    E.sidebarMainNav.innerHTML = build(S.sidebarItems.filter((item) => item.slot === "main"));
    E.sidebarFootNav.innerHTML = build(S.sidebarItems.filter((item) => item.slot === "foot"));
  }

  function sortedProjects() {
    const filtered = S.projects.filter((p) => {
      const text = p.name.toLowerCase().includes(S.filters.search.toLowerCase());
      const status = S.filters.status === "all" ? true : p.status.toLowerCase() === S.filters.status;
      return !p.archived && text && status;
    });
    const sortFn = (a, b) => (a.pinned !== b.pinned ? (a.pinned ? -1 : 1) : orderIndex(a.id) - orderIndex(b.id));
    return [...filtered].sort(sortFn);
  }

  function projectRow(project) {
    return `<div class="project-row" draggable="${!project.pinned}" data-project-id="${project.id}">
      <button class="row-handle" type="button" title="Arrastar"></button>
      <button class="project-name" type="button" data-open-project="${project.id}">
        <span class="project-mark" style="background:${project.color}"></span>
        <div class="project-copy">
          <span class="truncate">${project.name}</span>
          <span class="hint truncate">${project.description}</span>
        </div>
        <span class="status-dot ${statusClass(project.status)}"></span>
      </button>
      <span class="muted">${project.status}</span>
      <div class="row-actions">
        <button class="icon-tiny" type="button" data-row-action="up" data-id="${project.id}">↑</button>
        <button class="icon-tiny" type="button" data-row-action="down" data-id="${project.id}">↓</button>
      </div>
      <span class="caret" aria-hidden="true"></span>
    </div>`;
  }

  function renderProjects() {
    const visibleProjects = sortedProjects();
    E.projectList.innerHTML = visibleProjects.length
      ? visibleProjects.map(projectRow).join("")
      : `<div class="empty-note">Nenhum projeto visível com o filtro atual.</div>`;
  }

  function renderDashboardMetrics() {
    const activeProjects = S.projects.filter((p) => !p.archived && p.status === "Ativo").length;
    const triggers = S.projects.reduce((sum, p) => sum + (p.modules.triggers ? 1 : 0), 0);
    const integrations = S.projects.reduce((sum, p) => sum + (p.modules.webhooks ? 1 : 0), 0);
    E.kpiProjects.textContent = String(activeProjects || 0);
    E.kpiTriggers.textContent = triggers ? String(triggers) : "0";
    E.kpiIntegrations.textContent = integrations ? String(integrations) : "0";
  }

  function tabsFor(project) {
    return TABS.filter((tab) => tab.fixed || project.modules[tab.id]);
  }

  function renderProject() {
    const p = getProject(S.currentProjectId) || S.projects[0];
    if (!p) return;
    S.currentProjectId = p.id;
    E.projectName.textContent = p.name;
    E.projectStatus.textContent = p.status;
    E.projectDescription.textContent = p.description;
    const tabs = tabsFor(p);
    const current = S.currentTabByProject[p.id] && tabs.some((tab) => tab.id === S.currentTabByProject[p.id]) ? S.currentTabByProject[p.id] : "overview";
    S.currentTabByProject[p.id] = current;
    E.projectTabs.innerHTML = tabs.map((tab) => `<button class="tab ${tab.id === current ? "active" : ""}" type="button" data-tab="${tab.id}">${tab.label}</button>`).join("");
    E.projectTabPanels.innerHTML = tabs.map((tab) => {
      if (tab.id === "overview") return `<div class="tab-panel ${tab.id === current ? "active" : ""}" data-panel="overview"><section class="section-block"><div class="section-head"><h3>Resumo</h3><span class="hint">${p.status}</span></div><div class="empty-note">Projeto operacional e pronto para integrar dados reais.</div></section></div>`;
      if (tab.id === "settings") {
        return `<div class="tab-panel ${tab.id === current ? "active" : ""}" data-panel="settings"><div class="split-grid"><section class="section-block"><div class="section-head"><h3>Módulos ativos</h3><span class="hint">por projeto</span></div><div class="module-grid">${TABS.filter((t) => !t.fixed).map((t) => `<label class="setting-row"><span>${t.label}</span><input class="toggle" type="checkbox" data-module-toggle="${t.id}" ${p.modules[t.id] ? "checked" : ""}></label>`).join("")}</div></section><section class="section-block"><div class="section-head"><h3>Projeto</h3><span class="hint">autosave</span></div><div class="settings-grid"><label class="field"><span class="field-label">Nome</span><input class="inline-input" data-project-field="name" value="${p.name}"></label><label class="field"><span class="field-label">Descrição curta</span><input class="inline-input" data-project-field="description" value="${p.description}"></label><div class="field"><span class="field-label">Cor</span><div class="color-grid">${["#4a4a4f", "#5a5a60", "#6a6a70", "#7a7a80", "#8a8a90", "#9a9aa0", "#666b70", "#777d82", "#55595e", "#8f8f95"].map((color) => `<button class="color-chip ${p.color === color ? "active" : ""}" type="button" data-project-color="${color}" style="background:${color}"></button>`).join("")}</div></div><label class="field"><span class="field-label">Ícone</span><select class="inline-select" data-project-field="icon">${["bolt", "link", "sync", "db"].map((name) => `<option value="${name}" ${p.icon === name ? "selected" : ""}>${name}</option>`).join("")}</select></label><label class="setting-row"><span>Fixar no topo da lista</span><input class="toggle" type="checkbox" data-project-field="pinned" ${p.pinned ? "checked" : ""}></label></div></section><section class="section-block"><div class="section-head"><h3>Arquivamento</h3><span class="hint">configuração</span></div><div class="settings-grid"><div class="setting-row"><span>Remover da lista ativa</span><button class="ghost-button" type="button" data-project-archive="${p.id}">Arquivar projeto</button></div></div></section></div></div>`;
      }
      return `<div class="tab-panel ${tab.id === current ? "active" : ""}" data-panel="${tab.id}"><section class="section-block"><div class="section-head"><h3>${tab.label}</h3><span class="hint">ativo</span></div><div class="empty-note">Estrutura pronta para ${tab.label}</div></section></div>`;
    }).join("");
  }

  function renderNotifications() {
    const unread = S.notifications.filter((n) => !n.read).length;
    E.notifyBadge.classList.toggle("has-unread", unread > 0);
    E.notifyList.innerHTML = S.notifications.map((n, i) => `<div class="notification-item" style="animation-delay:${60 * i}ms" data-notify-id="${n.id}"><span class="status-dot ${n.read ? "inactive" : "active"}"></span><div><p>${n.text}</p><p class="hint">${n.time}</p></div><button class="icon-tiny" type="button" data-mark-read="${n.id}">✓</button></div>`).join("");
  }

  function toggleNotify(open) {
    S.notifyOpen = open;
    E.notifyPanel.classList.toggle("open", open);
    E.notifyOverlay.classList.toggle("open", open);
    save();
  }

  function renderProfile() {
    E.avatarMini.textContent = (S.auth.username || "JP").slice(0, 2).toUpperCase();
    E.userName.textContent = S.auth.username || "jp";
    E.userRole.textContent = S.auth.role || "Admin";
    E.profileContent.innerHTML = `<div class="profile-grid"><div class="avatar-large">${(S.auth.username || "JP").slice(0, 2).toUpperCase()}</div><div class="settings-grid"><label class="field"><span class="field-label">Nome</span><input class="inline-input" data-profile="username" value="${S.auth.username || "jp"}"></label><label class="field"><span class="field-label">E-mail</span><input class="inline-input" data-profile="email" value="${S.auth.email || "jp@studio.local"}"></label><label class="field"><span class="field-label">Role</span><select class="inline-select" data-profile="role"><option ${S.auth.role === "Admin" ? "selected" : ""}>Admin</option><option ${S.auth.role === "Editor" ? "selected" : ""}>Editor</option><option ${S.auth.role === "Viewer" ? "selected" : ""}>Viewer</option></select></label><button class="ghost-button" type="button" data-profile-save>Atualizar perfil</button></div></div>`;
  }

  function renderSystem() {
    E.systemSettingsContent.innerHTML = `<section class="section-block"><div class="section-head"><h3>Geral</h3></div><div class="settings-grid"><label class="setting-row"><span>Nome do sistema</span><input class="inline-input" data-setting="systemName" value="${S.settings.systemName}"></label><div class="setting-row"><span>Idioma</span><div class="row-actions"><button class="icon-tiny" data-language="pt">PT</button><button class="icon-tiny" data-language="en">EN</button></div></div><label class="setting-row"><span>Timezone</span><select class="inline-select" data-setting="timezone"><option>America/Fortaleza</option><option>America/Sao_Paulo</option><option>UTC</option><option>America/New_York</option></select></label></div></section><section class="section-block"><div class="section-head"><h3>Aparência</h3></div><div class="settings-grid"><label class="setting-row"><span>Modo escuro</span><input class="toggle" type="checkbox" id="global-theme-toggle" ${S.settings.theme === "dark" ? "checked" : ""}></label><div class="setting-row"><span>Raio</span><div class="row-actions"><button class="icon-tiny" data-radius="recto">Reto</button><button class="icon-tiny" data-radius="suave">Suave</button><button class="icon-tiny" data-radius="arredondado">Arredondado</button></div></div></div></section><section class="section-block"><div class="section-head"><h3>Notificações</h3></div><div class="settings-grid"><label class="setting-row"><span>Sistema</span><input class="toggle" type="checkbox" data-notify-setting="system" ${S.settings.notifications.system ? "checked" : ""}></label><label class="setting-row"><span>Projetos</span><input class="toggle" type="checkbox" data-notify-setting="projects" ${S.settings.notifications.projects ? "checked" : ""}></label><label class="setting-row"><span>Segurança</span><input class="toggle" type="checkbox" data-notify-setting="security" ${S.settings.notifications.security ? "checked" : ""}></label></div></section><section class="section-block"><div class="section-head"><h3>Integrações</h3></div><div class="settings-grid"><div class="setting-row"><span>Webhooks</span><span class="hint">estrutura pronta</span></div><div class="setting-row"><span>API Externa</span><span class="hint">estrutura pronta</span></div></div></section><section class="section-block"><div class="section-head"><h3>Segurança</h3></div><div class="settings-grid"><label class="setting-row"><span>Trocar senha</span><input class="inline-input" type="password" placeholder="Nova senha"></label><button class="ghost-button" type="button" id="security-logout">Encerrar sessão</button></div></section>`;
    const tz = E.systemSettingsContent.querySelector('[data-setting="timezone"]');
    if (tz) tz.value = S.settings.timezone;
  }
  function tryLogin() {
    const user = (E.loginUser.value || "").trim();
    const pass = E.loginPass.value || "";
    if (user === "jp" && pass === "1234") {
      S.auth.ok = true;
      S.auth.username = "jp";
      S.auth.role = "Admin";
      S.auth.email = "jp@studio.local";
      E.loginError.textContent = "";
      applyAuth();
      setActivePage("dashboard");
      renderProfile();
      toast("Bem-vindo");
      save();
      return;
    }
    E.loginError.textContent = "Usuário ou senha inválidos.";
  }

  function logout() {
    S.auth.ok = false;
    S.focusMode = false;
    S.notifyOpen = false;
    S.dropdownOpen = false;
    applyFocus();
    toggleNotify(false);
    E.userDropdown.classList.remove("open");
    applyAuth();
    save();
  }

  function bind() {
    document.addEventListener("click", (event) => {
      const t = event.target;
      const pageBtn = t.closest("[data-page-target]");
      if (pageBtn) setActivePage(pageBtn.dataset.pageTarget);

      const side = t.closest("[data-sidebar-item]");
      if (side) {
        const item = S.sidebarItems.find((i) => i.id === side.dataset.sidebarItem);
        if (!item) return;
        if (item.action === "theme") {
          S.settings.theme = S.settings.theme === "dark" ? "light" : "dark";
          applyTheme();
          renderSystem();
          toast("Tema atualizado");
          save();
          return;
        }
        if (item.page) setActivePage(item.page);
      }

      if (t.closest("[data-open-project]")) {
        S.currentProjectId = t.closest("[data-open-project]").dataset.openProject;
        setActivePage("project-detail");
        renderProject();
        save();
      }

      const rowAction = t.closest("[data-row-action]");
      if (rowAction) {
        const id = rowAction.dataset.id;
        const dir = rowAction.dataset.rowAction === "up" ? -1 : 1;
        const project = getProject(id);
        if (!project || project.pinned) return;
        const ids = S.projectOrder.filter((pid) => { const p = getProject(pid); return p && !p.pinned; });
        const from = ids.indexOf(id);
        const to = from + dir;
        if (to < 0 || to >= ids.length) return;
        const moved = move(ids, from, to);
        S.projectOrder = [...new Set([...moved, ...S.projectOrder])];
        renderProjects();
        save();
        toast("Ordem dos projetos atualizada");
      }

      const tabBtn = t.closest("[data-tab]");
      if (tabBtn) {
        const p = getProject(S.currentProjectId);
        S.currentTabByProject[p.id] = tabBtn.dataset.tab;
        renderProject();
        save();
      }

      const colorBtn = t.closest("[data-project-color]");
      if (colorBtn) {
        const p = getProject(S.currentProjectId);
        p.color = colorBtn.dataset.projectColor;
        renderProject();
        renderProjects();
        save();
        toast("Projeto atualizado");
      }

      const archiveBtn = t.closest("[data-project-archive]");
      if (archiveBtn) {
        const p = getProject(archiveBtn.dataset.projectArchive);
        p.archived = true;
        renderProjects();
        setActivePage("projects");
        save();
        toast("Projeto arquivado");
      }

      if (t.closest("[data-radius]")) {
        S.settings.radius = t.closest("[data-radius]").dataset.radius;
        applyRadius();
        save();
        toast("Raio atualizado");
      }

      if (t.closest("[data-language]")) {
        S.settings.language = t.closest("[data-language]").dataset.language;
        save();
        toast("Idioma atualizado");
      }

      const readBtn = t.closest("[data-mark-read]");
      if (readBtn) {
        const id = readBtn.dataset.markRead;
        const row = readBtn.closest(".notification-item");
        row?.classList.add("removing");
        setTimeout(() => {
          S.notifications = S.notifications.filter((item) => item.id !== id);
          renderNotifications();
          save();
        }, 220);
      }
      if (t.closest("#focus-from-settings") || t.closest("#focus-toggle")) {
        S.focusMode = !S.focusMode;
        applyFocus();
        save();
      }

      if (t.closest("#focus-exit")) {
        S.focusMode = false;
        applyFocus();
        save();
      }

      if (t.closest("#notify-button")) {
        toggleNotify(!S.notifyOpen);
      }

      if (t.closest("#notify-overlay")) {
        toggleNotify(false);
      }

      if (t.closest("#user-menu-button")) {
        S.dropdownOpen = !S.dropdownOpen;
        E.userDropdown.classList.toggle("open", S.dropdownOpen);
        save();
      }

      if (t.closest("#open-profile")) {
        setActivePage("profile");
        S.dropdownOpen = false;
        E.userDropdown.classList.remove("open");
      }

      if (t.closest("#logout-button") || t.closest("#security-logout")) {
        logout();
      }

      if (!t.closest(".user-menu-wrap")) {
        S.dropdownOpen = false;
        E.userDropdown.classList.remove("open");
      }

      const saveProfile = t.closest("[data-profile-save]");
      if (saveProfile) {
        toast("Perfil atualizado");
        save();
      }
    });

    document.addEventListener("input", (event) => {
      const t = event.target;
      if (t.id === "projects-search") {
        S.filters.search = t.value.trim();
        renderProjects();
        save();
      }

      if (t.dataset.projectField) {
        const p = getProject(S.currentProjectId);
        p[t.dataset.projectField] = t.type === "checkbox" ? t.checked : t.value;
        renderProject();
        renderProjects();
        save();
        toast("Projeto atualizado");
      }

      if (t.dataset.moduleToggle) {
        const p = getProject(S.currentProjectId);
        p.modules[t.dataset.moduleToggle] = t.checked;
        renderProject();
        renderDashboardMetrics();
        save();
      }

      if (t.id === "global-theme-toggle") {
        S.settings.theme = t.checked ? "dark" : "light";
        applyTheme();
        save();
      }

      if (t.dataset.setting) {
        S.settings[t.dataset.setting] = t.value;
        save();
      }

      if (t.dataset.notifySetting) {
        S.settings.notifications[t.dataset.notifySetting] = t.checked;
        save();
      }

      if (t.dataset.profile) {
        S.auth[t.dataset.profile] = t.value;
        renderProfile();
        save();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && document.activeElement && (document.activeElement.id === "login-user" || document.activeElement.id === "login-pass")) {
        tryLogin();
      }

      if (!S.auth.ok) return;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
      const key = `${event.ctrlKey || event.metaKey ? "ctrl+" : ""}${event.shiftKey ? "shift+" : ""}${event.key.toLowerCase()}`;
      if (key === S.shortcuts.dashboard) setActivePage("dashboard");
      if (key === S.shortcuts.projects) setActivePage("projects");
      if (key === S.shortcuts.search) { event.preventDefault(); E.globalSearch.focus(); }
      if (key === S.shortcuts.focus) { S.focusMode = !S.focusMode; applyFocus(); save(); }
      if (event.key === S.shortcuts.sidebar) { S.sidebarOpen = !S.sidebarOpen; applySidebar(); save(); }
      if (/^[1-9]$/.test(event.key) && S.page === "project-detail") {
        const p = getProject(S.currentProjectId);
        const tabs = tabsFor(p);
        const target = tabs[Number(event.key) - 1];
        if (target) {
          S.currentTabByProject[p.id] = target.id;
          renderProject();
          save();
        }
      }
    });

    E.loginSubmit?.addEventListener("click", tryLogin);
    E.sidebarToggle?.addEventListener("click", () => { S.sidebarOpen = !S.sidebarOpen; applySidebar(); save(); });
    E.projectsFilterButton?.addEventListener("click", () => {
      const order = ["all", "ativo", "pausado", "inativo"];
      const next = order[(order.indexOf(S.filters.status) + 1) % order.length];
      S.filters.status = next;
      E.projectsFilterButton.textContent = `Filtrar: ${next === "all" ? "Todos" : next}`;
      renderProjects();
      save();
    });
    document.addEventListener("dragstart", (event) => {
      const projectRow = event.target.closest(".project-row");
      const sidebarRow = event.target.closest(".sidebar-item-row");
      if (projectRow) {
        draggingProject = projectRow.dataset.projectId;
        projectRow.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";
      }
      if (sidebarRow) {
        draggingSidebar = sidebarRow.dataset.sidebarId;
        event.dataTransfer.effectAllowed = "move";
      }
    });

    document.addEventListener("dragend", (event) => {
      event.target.closest(".project-row")?.classList.remove("dragging");
      draggingProject = null;
      draggingSidebar = null;
    });

    document.addEventListener("dragover", (event) => {
      if (draggingProject || draggingSidebar) event.preventDefault();
    });

    document.addEventListener("drop", (event) => {
      const targetProject = event.target.closest(".project-row");
      if (targetProject && draggingProject && targetProject.dataset.projectId !== draggingProject) {
        event.preventDefault();
        S.projectOrder = move(S.projectOrder, S.projectOrder.indexOf(draggingProject), S.projectOrder.indexOf(targetProject.dataset.projectId));
        renderProjects();
        save();
      }

      const targetSide = event.target.closest(".sidebar-item-row");
      if (targetSide && draggingSidebar && targetSide.dataset.sidebarId !== draggingSidebar) {
        event.preventDefault();
        const from = S.sidebarItems.findIndex((x) => x.id === draggingSidebar);
        const to = S.sidebarItems.findIndex((x) => x.id === targetSide.dataset.sidebarId);
        S.sidebarItems = move(S.sidebarItems, from, to);
        renderSidebar();
        renderSystem();
        save();
      }
    });
  }

  function init() {
    if (!S.projectOrder?.length) S.projectOrder = S.projects.map((p) => p.id);
    E.projectsSearch.value = S.filters.search || "";
    E.projectsFilterButton.textContent = `Filtrar: ${S.filters.status === "all" ? "Todos" : S.filters.status}`;
    applyTheme();
    applyRadius();
    applySidebar();
    applyFocus();
    applyAuth();
    renderSidebar();
    renderProjects();
    renderProject();
    renderDashboardMetrics();
    renderSystem();
    renderProfile();
    renderNotifications();
    setActivePage(S.auth.ok ? "dashboard" : S.page);
    toggleNotify(false);
    bind();
    if (!S.auth.ok) {
      setTimeout(() => E.loginUser?.focus(), 60);
    }
  }

  init();
})();
