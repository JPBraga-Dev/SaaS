## Studio Panel

Servidor local em Python com entrada única em `server.py`.

### Rodar

```bash
python server.py
```

### Endpoints

- `/` painel principal
- `/health` status simples do servidor
- `/static/js/app.js` assets da interface
- `/data/studio_panel_schema.sql` schema SQL

### Estrutura

- `server.py` servidor HTTP local
- `templates/index.html` interface principal
- `static/js/app.js` comportamento do painel
- `data/studio_panel_schema.sql` banco SQL inicial
# SaaS
 12
