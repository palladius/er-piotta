#!/usr/bin/env python3
"""
Static & API HTTP server for er-piotta on http://localhost:7107
- Serves `dist/` at both `/` and `/er-piotta/`
- Exposes `GET /api/tickets-state` and `POST /api/ticket` so Owner (Ricc/Kate/Nessuno)
  and Notes changes in the Gmail Web UI persist both to `src/data/piota_feed.json`
  and to Google Cloud Firestore (`palladius-genai/piota_items`)!
"""
import http.server
import json
import os
import socketserver
import subprocess
import sys
import threading

PORT = 7107
REPO_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(REPO_DIR, "dist")
FEED_JSON_PATH = os.path.join(REPO_DIR, "src", "data", "piota_feed.json")
PVT_PYTHON = "/home/riccardo/git/er-piotta-pvt/.venv/bin/python3"
PVT_ROOT = "/home/riccardo/git/er-piotta-pvt"

_feed_lock = threading.Lock()


def _update_feed_and_firestore(payload: dict) -> dict:
    item_id = str(payload.get("id") or "").strip()
    if not item_id:
        return {"ok": False, "error": "Missing item id"}

    owner = payload.get("owner")
    note = payload.get("note")
    status = payload.get("status")
    archived = payload.get("archived")
    read_r = payload.get("read_by_riccardo")
    read_k = payload.get("read_by_kate")
    user = str(payload.get("user") or "riccardo").lower()

    updated_item = None
    with _feed_lock:
        if os.path.exists(FEED_JSON_PATH):
            try:
                with open(FEED_JSON_PATH, "r", encoding="utf-8") as f:
                    items = json.load(f)
                for it in items:
                    if it.get("id") == item_id:
                        t = it.setdefault("ticket", {})
                        c = it.setdefault("consumption", {})
                        if owner is not None:
                            t["owner"] = owner
                            t["status"] = "claimed" if owner not in ("unassigned", "nessuno", "") else "open"
                        if status is not None:
                            t["status"] = status
                        if note is not None:
                            t["note"] = note
                        if archived is not None:
                            c["archived"] = bool(archived)
                        if read_r is not None:
                            c["read_by_riccardo"] = bool(read_r)
                        if read_k is not None:
                            c["read_by_kate"] = bool(read_k)
                        updated_item = {"ticket": t, "consumption": c}
                        break
                if updated_item is not None:
                    with open(FEED_JSON_PATH, "w", encoding="utf-8") as f:
                        json.dump(items, f, indent=2, ensure_ascii=False)
            except Exception as e:
                print(f"Warning updating local feed JSON: {e}", file=sys.stderr)

    # Sync asynchronously to Google Cloud Firestore (palladius-genai/piota_items)
    def _push_firestore():
        if not os.path.exists(PVT_PYTHON):
            return
        code = (
            "import sys, json; sys.path.insert(0, %r); "
            "from src.firestore_db import PiotaFirestore; "
            "fs = PiotaFirestore('palladius-genai'); "
            "p = json.loads(sys.argv[1]); "
            "fs.update_ticket(p['id'], owner=p.get('owner'), status=p.get('status'), note=p.get('note'), user=p.get('user','riccardo'))"
        ) % PVT_ROOT
        try:
            subprocess.run([PVT_PYTHON, "-c", code, json.dumps(payload)], timeout=15, check=False)
        except Exception as e:
            print(f"Firestore background update warning: {e}", file=sys.stderr)

    threading.Thread(target=_push_firestore, daemon=True).start()
    return {"ok": True, "id": item_id, "updated": updated_item}


class PiotaHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def _send_json(self, status_code: int, data: dict):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        clean_path = self.path.split("?", 1)[0]
        if clean_path in ("/api/tickets-state", "/er-piotta/api/tickets-state"):
            state_map = {}
            if os.path.exists(FEED_JSON_PATH):
                try:
                    with _feed_lock:
                        with open(FEED_JSON_PATH, "r", encoding="utf-8") as f:
                            items = json.load(f)
                    for it in items:
                        iid = it.get("id")
                        if iid:
                            state_map[iid] = {
                                "ticket": it.get("ticket", {}),
                                "consumption": it.get("consumption", {}),
                            }
                except Exception as e:
                    return self._send_json(500, {"ok": False, "error": str(e)})
            return self._send_json(200, {"ok": True, "states": state_map})
        return super().do_GET()

    def do_POST(self):
        clean_path = self.path.split("?", 1)[0]
        if clean_path in ("/api/ticket", "/er-piotta/api/ticket"):
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"
            try:
                payload = json.loads(raw)
            except Exception:
                return self._send_json(400, {"ok": False, "error": "Invalid JSON"})
            res = _update_feed_and_firestore(payload)
            return self._send_json(200 if res.get("ok") else 400, res)
        self.send_error(404, "Endpoint not found")

    def translate_path(self, path):
        if path.startswith("/er-piotta/"):
            path = path[len("/er-piotta"):]
        elif path == "/er-piotta":
            path = "/"
        return super().translate_path(path)


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), PiotaHandler) as httpd:
        print(f"Serving er-piotta on http://0.0.0.0:{PORT}")
        httpd.serve_forever()
