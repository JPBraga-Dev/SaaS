from __future__ import annotations

import argparse
import json
import mimetypes
import os
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse


BASE_DIR = Path(__file__).resolve().parent
TEMPLATES_DIR = BASE_DIR / "templates"
STATIC_DIR = BASE_DIR / "static"
DATA_DIR = BASE_DIR / "data"
INDEX_FILE = TEMPLATES_DIR / "index.html"


class StudioPanelHandler(BaseHTTPRequestHandler):
    server_version = "StudioPanel/1.0"

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        route = unquote(parsed.path)

        if route in {"/", "/index.html"}:
            self.serve_file(INDEX_FILE, "text/html; charset=utf-8")
            return

        if route == "/health":
            self.send_json(
                {
                    "status": "ok",
                    "app": "Studio Panel",
                    "static": str(STATIC_DIR.relative_to(BASE_DIR)),
                    "templates": str(TEMPLATES_DIR.relative_to(BASE_DIR)),
                }
            )
            return

        if route.startswith("/static/"):
            self.serve_safe_path(STATIC_DIR, route.removeprefix("/static/"))
            return

        if route.startswith("/data/"):
            self.serve_safe_path(DATA_DIR, route.removeprefix("/data/"))
            return

        self.send_error(HTTPStatus.NOT_FOUND, "Rota não encontrada.")

    def log_message(self, format: str, *args) -> None:
        return

    def send_json(self, payload: dict[str, object], status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def serve_safe_path(self, root: Path, raw_relative_path: str) -> None:
        requested = (root / raw_relative_path).resolve()
        try:
            requested.relative_to(root.resolve())
        except ValueError:
            self.send_error(HTTPStatus.FORBIDDEN, "Acesso negado.")
            return

        if not requested.is_file():
            self.send_error(HTTPStatus.NOT_FOUND, "Arquivo não encontrado.")
            return

        content_type = mimetypes.guess_type(requested.name)[0] or "application/octet-stream"
        if content_type.startswith("text/") or content_type in {"application/javascript", "application/json"}:
            content_type = f"{content_type}; charset=utf-8"
        self.serve_file(requested, content_type)

    def serve_file(self, file_path: Path, content_type: str) -> None:
        if not file_path.is_file():
            self.send_error(HTTPStatus.NOT_FOUND, "Arquivo não encontrado.")
            return

        data = file_path.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Servidor local do Studio Panel.")
    parser.add_argument("--host", default=os.getenv("STUDIO_PANEL_HOST", "127.0.0.1"))
    parser.add_argument("--port", type=int, default=int(os.getenv("STUDIO_PANEL_PORT", "8000")))
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    server = ThreadingHTTPServer((args.host, args.port), StudioPanelHandler)
    print(f"Studio Panel disponível em http://{args.host}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nEncerrando servidor...")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
