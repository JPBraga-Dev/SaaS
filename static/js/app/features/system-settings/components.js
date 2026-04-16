export function sectionKicker(label) {
  return `<span class="section-kicker">${label}</span>`;
}

export function settingsBadge(label) {
  return `<span class="settings-card-badge">${label}</span>`;
}

export function settingsMetaChip(label, value) {
  return `<span class="meta-chip">${label} <strong>${value}</strong></span>`;
}

export function settingsCard({ title, kicker, description, badge, body, sectionIndex = 0 }) {
  return `<section class="settings-card" style="--section-index:${sectionIndex}"><div class="settings-card-head"><div class="settings-card-title">${sectionKicker(kicker)}<h3>${title}</h3><p>${description}</p></div>${badge ? settingsBadge(badge) : ""}</div><div class="settings-card-body">${body}</div></section>`;
}

export function settingsFieldCard({ label, control, help = "", wide = false }) {
  return `<label class="settings-field-card ${wide ? "wide" : ""}"><span class="field-label">${label}</span>${control}${help ? `<span class="setting-help">${help}</span>` : ""}</label>`;
}

export function settingsInlineCard({ label, meta = "", control }) {
  return `<div class="settings-inline-card"><div class="settings-copy"><span class="setting-label">${label}</span>${meta ? `<span class="setting-meta">${meta}</span>` : ""}</div>${control}</div>`;
}

export function optionChip({ id, label, active, dataset }) {
  return `<button class="icon-tiny option-chip ${active ? "active" : ""}" type="button" ${dataset} aria-pressed="${active ? "true" : "false"}">${label}</button>`;
}

export function integrationCard({ badge, icon, title, description }) {
  return `<article class="integration-card"><div class="integration-top"><span class="integration-icon">${icon}</span>${settingsBadge(badge)}</div><div class="settings-copy"><span class="setting-label">${title}</span><span class="setting-meta">${description}</span></div></article>`;
}

export function securityAction({ title, description, icon, body, danger = false }) {
  return `<article class="security-action ${danger ? "danger" : ""}"><div class="security-top"><div class="settings-copy"><span class="setting-label">${title}</span><span class="setting-meta">${description}</span></div><span class="security-icon">${icon}</span></div>${body}</article>`;
}
