export function createElementRefs(documentRef = document) {
  return {
    authShell: documentRef.getElementById("auth-shell"),
    loginUser: documentRef.getElementById("login-user"),
    loginPass: documentRef.getElementById("login-pass"),
    loginSubmit: documentRef.getElementById("login-submit"),
    loginError: documentRef.getElementById("login-error"),
    headerTitle: documentRef.getElementById("header-title"),
    globalSearch: documentRef.getElementById("global-search"),
    projectsFilterButton: documentRef.getElementById("projects-filter-button"),
    projectsSearch: documentRef.getElementById("projects-search"),
    sidebarMainNav: documentRef.getElementById("sidebar-main-nav"),
    sidebarFootNav: documentRef.getElementById("sidebar-foot-nav"),
    sidebarToggle: documentRef.querySelector("[data-sidebar-toggle]"),
    projectList: documentRef.getElementById("project-list"),
    projectName: documentRef.getElementById("project-name"),
    projectStatus: documentRef.getElementById("project-status"),
    projectDescription: documentRef.getElementById("project-description"),
    projectTabs: documentRef.getElementById("project-tabs"),
    projectTabPanels: documentRef.getElementById("project-tab-panels"),
    systemSettingsContent: documentRef.getElementById("system-settings-content"),
    profileContent: documentRef.getElementById("profile-content"),
    focusToggle: documentRef.getElementById("focus-toggle"),
    focusExit: documentRef.getElementById("focus-exit"),
    toastStack: documentRef.getElementById("toast-stack"),
    notifyButton: documentRef.getElementById("notify-button"),
    notifyBadge: documentRef.getElementById("notify-badge"),
    notifyPanel: documentRef.getElementById("notify-panel"),
    notifyOverlay: documentRef.getElementById("notify-overlay"),
    notifyList: documentRef.getElementById("notify-list"),
    userMenuButton: documentRef.getElementById("user-menu-button"),
    userDropdown: documentRef.getElementById("user-dropdown"),
    avatarMini: documentRef.getElementById("avatar-mini"),
    userName: documentRef.getElementById("user-name"),
    userRole: documentRef.getElementById("user-role"),
    openProfile: documentRef.getElementById("open-profile"),
    logoutButton: documentRef.getElementById("logout-button"),
    kpiProjects: documentRef.getElementById("kpi-projects"),
    kpiTriggers: documentRef.getElementById("kpi-triggers"),
    kpiIntegrations: documentRef.getElementById("kpi-integrations")
  };
}

export function createPageRefs(documentRef = document) {
  return {
    dashboard: documentRef.getElementById("page-dashboard"),
    projects: documentRef.getElementById("page-projects"),
    "project-detail": documentRef.getElementById("page-project-detail"),
    "system-settings": documentRef.getElementById("page-system-settings"),
    profile: documentRef.getElementById("page-profile")
  };
}
