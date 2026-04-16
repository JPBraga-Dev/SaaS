import { SYSTEM_SETTING_OPTIONS } from "./config.js";
import {
  integrationCard,
  optionChip,
  securityAction,
  settingsCard,
  settingsFieldCard,
  settingsInlineCard,
  settingsMetaChip
} from "./components.js";

function timezoneLabel(value) {
  return value.replace("America/", "");
}

function renderLanguageControl(settings) {
  return `<div class="segmented-control">${SYSTEM_SETTING_OPTIONS.languages.map((option) => optionChip({
    id: option.id,
    label: option.label,
    active: settings.language === option.id,
    dataset: `data-language="${option.id}"`
  })).join("")}</div>`;
}

function renderRadiusControl(settings) {
  return `<div class="segmented-control">${SYSTEM_SETTING_OPTIONS.radius.map((option) => optionChip({
    id: option.id,
    label: option.label,
    active: settings.radius === option.id,
    dataset: `data-radius="${option.id}"`
  })).join("")}</div>`;
}

function renderGeneralCard(settings) {
  const fieldGrid = [
    settingsFieldCard({
      label: "Nome do sistema",
      control: `<input class="inline-input" data-setting="systemName" value="${settings.systemName}">`,
      wide: true
    }),
    settingsInlineCard({
      label: "Idioma",
      meta: "Define a linguagem principal da interface.",
      control: renderLanguageControl(settings)
    }),
    settingsFieldCard({
      label: "Timezone",
      control: `<select class="inline-select" data-setting="timezone">${SYSTEM_SETTING_OPTIONS.timezones.map((zone) => `<option ${zone === settings.timezone ? "selected" : ""}>${zone}</option>`).join("")}</select>`,
      help: "Usado para datas, horários e eventos exibidos no painel."
    })
  ].join("");

  return settingsCard({
    kicker: "Geral",
    title: "Base do sistema",
    description: "Nome da instância, idioma padrão e fuso principal da interface.",
    badge: "Essencial",
    sectionIndex: 0,
    body: `<div class="settings-field-grid">${fieldGrid}</div>`
  });
}

function renderAppearanceCard(settings) {
  return settingsCard({
    kicker: "Aparência",
    title: "Look and feel",
    description: "Ajustes visuais globais com impacto imediato em toda a interface.",
    badge: "Visual",
    sectionIndex: 1,
    body: [
      settingsInlineCard({
        label: "Modo escuro",
        meta: "Mantém a identidade dark do Studio Panel com leitura confortável.",
        control: `<input class="toggle" type="checkbox" id="global-theme-toggle" ${settings.theme === "dark" ? "checked" : ""}>`
      }),
      settingsInlineCard({
        label: "Raio global",
        meta: "Controla o acabamento de cards, inputs e botões.",
        control: renderRadiusControl(settings)
      })
    ].join("")
  });
}

function renderNotificationsCard(settings) {
  return settingsCard({
    kicker: "Notificações",
    title: "Preferências de alerta",
    description: "Controle o que chega ao painel sem gerar ruído desnecessário.",
    badge: "Operação",
    sectionIndex: 2,
    body: SYSTEM_SETTING_OPTIONS.notificationTypes.map((item) => `<label class="settings-inline-card"><div class="settings-copy"><span class="setting-label">${item.label}</span><span class="setting-meta">${item.description}</span></div><input class="toggle" type="checkbox" data-notify-setting="${item.id}" ${settings.notifications[item.id] ? "checked" : ""}></label>`).join("")
  });
}

function renderIntegrationsCard() {
  return settingsCard({
    kicker: "Integrações",
    title: "Conexões prontas",
    description: "Estrutura visual preparada para conexões externas e pontos de sincronização.",
    badge: "Estrutura",
    sectionIndex: 3,
    body: `<div class="integration-list">${SYSTEM_SETTING_OPTIONS.integrations.map(integrationCard).join("")}</div>`
  });
}

function renderSecurityCard() {
  return settingsCard({
    kicker: "Segurança",
    title: "Ações sensíveis",
    description: "Operações críticas destacadas para reduzir erro e melhorar leitura do risco.",
    badge: "Crítico",
    sectionIndex: 4,
    body: `<div class="security-stack">${[
      securityAction({
        title: SYSTEM_SETTING_OPTIONS.security.password.title,
        description: SYSTEM_SETTING_OPTIONS.security.password.description,
        icon: SYSTEM_SETTING_OPTIONS.security.password.icon,
        body: `<input class="inline-input" type="password" placeholder="${SYSTEM_SETTING_OPTIONS.security.password.placeholder}">`
      }),
      securityAction({
        title: SYSTEM_SETTING_OPTIONS.security.logout.title,
        description: SYSTEM_SETTING_OPTIONS.security.logout.description,
        icon: SYSTEM_SETTING_OPTIONS.security.logout.icon,
        danger: true,
        body: `<button class="ghost-button full-width" type="button" id="security-logout">${SYSTEM_SETTING_OPTIONS.security.logout.actionLabel}</button>`
      })
    ].join("")}</div>`
  });
}

export function renderSystemSettingsPage(settings) {
  return `<div class="system-shell"><section class="system-hero"><div class="system-hero-copy"><span class="section-kicker">Configurações gerais</span><h3>${settings.systemName}</h3><p>Preferências centrais do ambiente, aparência, alertas e políticas de acesso organizadas para leitura rápida e manutenção contínua.</p></div><div class="system-hero-meta">${[
    settingsMetaChip("Tema", settings.theme === "dark" ? "Escuro" : "Claro"),
    settingsMetaChip("Idioma", settings.language.toUpperCase()),
    settingsMetaChip("Timezone", timezoneLabel(settings.timezone))
  ].join("")}</div></section><div class="system-grid"><div class="system-column">${[
    renderGeneralCard(settings),
    renderAppearanceCard(settings),
    renderNotificationsCard(settings)
  ].join("")}</div><div class="system-column">${[
    renderIntegrationsCard(),
    renderSecurityCard()
  ].join("")}</div></div></div>`;
}
