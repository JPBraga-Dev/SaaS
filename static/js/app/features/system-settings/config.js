export const SYSTEM_SETTING_OPTIONS = {
  languages: [
    { id: "pt", label: "PT", description: "Define a linguagem principal da interface." },
    { id: "en", label: "EN", description: "Prepare a base para operação internacional." }
  ],
  radius: [
    { id: "recto", label: "Reto", description: "Acabamento mais técnico e contido." },
    { id: "suave", label: "Suave", description: "Equilíbrio visual padrão do painel." },
    { id: "arredondado", label: "Arredondado", description: "Aspecto mais amigável e macio." }
  ],
  timezones: ["America/Fortaleza", "America/Sao_Paulo", "UTC", "America/New_York"],
  notificationTypes: [
    {
      id: "system",
      label: "Sistema",
      description: "Eventos gerais, alterações de ambiente e confirmações internas."
    },
    {
      id: "projects",
      label: "Projetos",
      description: "Acompanhamento de mudanças e eventos relevantes por projeto."
    },
    {
      id: "security",
      label: "Segurança",
      description: "Sessões, autenticação e ações críticas de proteção."
    }
  ],
  integrations: [
    {
      id: "webhooks",
      title: "Webhooks",
      badge: "Webhook",
      icon: "W",
      description: "Canal pronto para receber endpoints, callbacks e eventos assinados."
    },
    {
      id: "external-api",
      title: "API externa",
      badge: "API",
      icon: "A",
      description: "Espaço reservado para provedores, chaves e autenticações futuras."
    }
  ],
  security: {
    password: {
      title: "Trocar senha",
      icon: "S",
      description: "Atualize a credencial local do ambiente com um novo valor.",
      placeholder: "Nova senha"
    },
    logout: {
      title: "Encerrar sessão",
      icon: "!",
      description: "Finaliza imediatamente a sessão atual deste usuário.",
      actionLabel: "Encerrar sessão"
    }
  }
};
