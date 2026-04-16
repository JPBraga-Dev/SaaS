# Project UI Contract

## Objetivo

Garantir que a área de Projetos só exponha controles e estados realmente suportados pelo produto.

## Regras atuais

- Status de projeto não deve ser exibido enquanto não existir fluxo real de gestão de status.
- Filtros de projeto não podem depender de campos que o usuário não consegue alterar.
- Seleção de ícone só pode usar opções existentes no catálogo interno do frontend.
- Seleção de cor deve usar uma paleta funcional e visível no tema escuro.
- Toda opção configurável precisa ter uma fonte única de verdade no código.

## Fonte única atual

No arquivo `static/js/app.js`:

- `PROJECT_ICON_OPTIONS`: catálogo suportado de ícones de projeto
- `PROJECT_COLOR_OPTIONS`: paleta suportada para cor do ícone

## Padrão para próximas expansões

Antes de exibir qualquer novo controle na UI de Projetos:

1. Definir o dado no estado
2. Definir o catálogo suportado, se houver opções
3. Conectar a opção ao render visual real
4. Só então expor o controle na interface

## Checklist rápido

- O usuário consegue alterar isso de verdade?
- O valor aparece refletido em algum ponto visível do produto?
- Existe fallback seguro se o dado não vier salvo?
- A opção está centralizada em um catálogo ou constante única?
