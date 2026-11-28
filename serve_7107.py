#!/usr/bin/env python3
"""
Static & API HTTP server for er-piotta on http://localhost:7107
- Serves `dist/` at both `/` and `/er-piotta/`
- Exposes `GET /api/tickets-state` and `POST /api/ticket` so Owner (Ricc/Kate/Nessuno)
  and Notes changes in the Gmail Web UI persist both to `src/data/piota_feed.json`
  and to Google Cloud Firestore (`palladius-genai/piota_items`)!
"""
import datetime
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
PVT_CLI = "/home/riccardo/git/er-piotta-pvt/bin/piota-cli"
PVT_ROOT = "/home/riccardo/git/er-piotta-pvt"
PVT_FACE_CROPS_DIR = os.path.join(PVT_ROOT, "data", "face_crops")

_feed_lock = threading.Lock()


def _get_last_synced_iso(items: list) -> str:
    """Return ISO timestamp of latest sync (max of file mtime and item crawled_at)."""
    candidates = []
    if os.path.exists(FEED_JSON_PATH):
        try:
            mtime = os.path.getmtime(FEED_JSON_PATH)
            candidates.append(datetime.datetime.fromtimestamp(mtime, tz=datetime.timezone.utc).isoformat())
        except Exception:
            pass
    for it in items:
        ca = str(it.get("crawled_at") or "")
        if ca and len(ca) >= 10:
            candidates.append(ca)
    return max(candidates) if candidates else datetime.datetime.now(datetime.timezone.utc).isoformat()


def _answer_ai_question(query: str) -> dict:
    """Answer user question using active emails & calendar events (Vertex AI / Gemini + deterministic fallback)."""
    q = (query or "").strip()
    if not q:
        return {"ok": False, "error": "Domanda vuota"}

    items = []
    if os.path.exists(FEED_JSON_PATH):
        with _feed_lock:
            try:
                with open(FEED_JSON_PATH, "r", encoding="utf-8") as f:
                    items = json.load(f)
            except Exception:
                items = []

    today_iso = datetime.date.today().isoformat()
    q_low = q.lower()

    # Filter active & relevant items
    active_items = []
    for it in items:
        iid = str(it.get("id") or "")
        itype = it.get("type", "alert")
        if itype == "event" and iid.startswith("event_") and not iid.startswith("event_gcal_"):
            continue
        if itype == "alert" and not iid.startswith("alert_gmail_"):
            continue
        title = str(it.get("title") or "")
        body = str(it.get("body") or "")
        if title.startswith("Fwd: [") or "Briefing Settimana" in title or "Weekly Digest" in title:
            continue
        raw_ev = str(it.get("datestart") or it.get("created_at") or today_iso)[:10]
        if itype == "event" and raw_ev < today_iso:
            continue
        active_items.append(it)

    # Score items against query
    want_seb = any(w in q_low for w in ["sebi", "seby", "seb", "p1", "primary 1", "faux", "rayment"])
    want_ale = any(w in q_low for w in ["ale", "alessandro", "p3", "primary 3", "biehl", "penrose"])
    want_fr = any(w in q_low for w in ["francese", "french", "français", "conde", "leçon"])
    want_de = any(w in q_low for w in ["tedesco", "deutsch", "german", "übungsheft", "schreibheft"])
    want_en = any(w in q_low for w in ["inglese", "english", "gps", "reading", "sats", "raz"])
    want_math = any(w in q_low for w in ["mate", "mathe", "math", "lzk", "ziffern", "test", "verific"])
    want_piano = any(w in q_low for w in ["piano", "pianoforte", "musica", "spartiti"])
    want_photo = any(w in q_low for w in ["foto", "photo", "album", "diwali"])
    want_hw = any(w in q_low for w in ["compit", "homework", "studiar", "fare", "quando", "zaino", "settimana", "luned", "marted", "gioved", "venerd"])

    scored = []
    for it in active_items:
        iid = str(it.get("id") or "")
        itype = it.get("type", "alert")
        raw_ev = str(it.get("datestart") or it.get("created_at") or today_iso)[:10]
        text = f"{it.get('title','')} {it.get('body','')} {it.get('sender','')}".lower()
        t_low = str(it.get("title") or "").lower()
        kids = [k.lower() for k in it.get("target_kids", [])]
        is_ale = any(k in ("ale", "alessandro", "p3") for k in kids) or "p3" in text or "primary 3" in text
        is_seb = any(k in ("seby", "sebastian", "seb", "p1") for k in kids) or "p1" in text or "primary 1" in text
        score = 0
        if want_seb and is_seb and not is_ale:
            score += 6
        elif want_seb and not is_seb:
            score -= 8
        if want_ale and is_ale and not is_seb:
            score += 6
        elif want_ale and not is_ale:
            score -= 8

        is_hw_or_test = any(w in t_low for w in ["hw:", "homework", "test", "lzk", "lernzielkontrolle", "sats", "pianoforte", "library", "bibliothek", "raz kids"])
        if want_hw:
            if itype == "event" and today_iso <= raw_ev <= (datetime.date.today() + datetime.timedelta(days=10)).isoformat() and is_hw_or_test:
                score += 12
            elif is_hw_or_test:
                score += 6
            elif any(w in t_low for w in ["kalender link", "timetable", "weekly photo", "lexus"]):
                score -= 5

        if want_fr and any(w in text for w in ["french", "français", "leçon", "aconde", "amaia conde", "mon emploi du temps"]):
            score += 10
        if want_de and any(w in text for w in ["deutsch", "übungsheft", "schreibheft", "schlittschuh"]):
            score += 10
        if want_en and any(w in text for w in ["english", "gps", "grammar", "reading", "sats", "raz"]):
            score += 10
        if want_math and any(w in text for w in ["mathe", "lzk", "ziffern", "lernzielkontrolle"]):
            score += 10
        if want_piano and any(w in text for w in ["piano", "pianoforte"]):
            score += 10
        if want_photo and any(w in text for w in ["photo", "album", "goo.gl"]):
            score += 10

        for token in [w for w in q_low.replace("?", " ").split() if len(w) > 3]:
            if token in text:
                score += 2
        if score > 0:
            scored.append((score, it))

    scored.sort(key=lambda x: (-x[0], str(x[1].get("datestart") or x[1].get("created_at") or "")))
    top_matches = [it for _, it in scored[:6]]
    if not top_matches:
        top_matches = active_items[:6]

    matched_ids = [it["id"] for it in top_matches if it.get("id")]

    # Try calling Gemini via google-genai in PVT_PYTHON
    ai_answer = None
    if os.path.exists(PVT_PYTHON):
        ctx_docs = []
        for it in top_matches:
            ctx_docs.append({
                "id": it.get("id"),
                "title": it.get("title"),
                "date": str(it.get("datestart") or it.get("created_at") or "")[:10],
                "kids": it.get("target_kids"),
                "body": str(it.get("body") or "")[:900],
            })
        py_script = (
            "import sys, os, json\n"
            "from google import genai\n"
            "q = sys.argv[1]\n"
            "docs = json.loads(sys.argv[2])\n"
            "api_key = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')\n"
            "client = genai.Client(api_key=api_key) if api_key else genai.Client(vertexai=True, project='palladius-genai', location='us-central1')\n"
            "prompt = f'''Sei Piota AI, assistente scolastico per Riccardo e Kate (figli: Ale in Primary 3 e Seby in Primary 1 a Tandem IMS Seefeld). "
            "Rispondi in italiano in modo super pratico, conciso e diretto (punti elenco Markdown) alla domanda: {q}\\n"
            "Per OGNI compito o email che citi, inserisci un link Markdown locale nel formato esatto [📧 Titolo Breve](#item:ID_DOCUMENTO) usando il campo id di ciascun documento.\\n"
            "Documenti:\\n{json.dumps(docs, ensure_ascii=False)}'''\n"
            "resp = client.models.generate_content(model='gemini-3.8-flash', contents=prompt)\n"
            "print(resp.text.strip())\n"
        )
        try:
            proc = subprocess.run(
                [PVT_PYTHON, "-c", py_script, q, json.dumps(ctx_docs, ensure_ascii=False)],
                capture_output=True,
                text=True,
                timeout=12,
                check=False,
            )
            if proc.returncode == 0 and proc.stdout.strip():
                ai_answer = proc.stdout.strip()
        except Exception:
            pass

    if not ai_answer:
        # Crisp deterministic Italian synthesis with clickable local Magic Links [#item:<id>]
        lines = []
        for it in top_matches[:5]:
            iid = it.get("id", "")
            icon = "📧" if it.get("type") == "alert" else "📅"
            t = str(it.get("title") or "").replace("[P1 Seby] ", "").replace("[P3 Ale] ", "")
            d = str(it.get("datestart") or it.get("created_at") or "")[:10]
            b = " ".join(
                ln.strip() for ln in str(it.get("body") or "").splitlines()
                if ln.strip()
                and not ln.startswith("#")
                and not ln.startswith("**")
                and not ln.startswith("[[AUTO_TRANSLATED")
                and not ln.startswith("---")
                and not ln.startswith("*")
                and not ln.startswith("Class calendar")
            )
            if len(b) > 200:
                b = b[:197] + "..."
            lines.append(f"- **{d}** — [{icon} {t}](#item:{iid}): {b}")
        ai_answer = (
            f"Ecco i compiti e le comunicazioni rilevanti per **\"{q}\"** (clicca direttamente sui link blu per aprire l'email o il compito nell'app):\n\n"
            + "\n".join(lines)
        )

    return {
        "ok": True,
        "query": q,
        "answer": ai_answer,
        "matched_ids": matched_ids,
    }


def _update_feed_and_firestore(payload: dict) -> dict:
    item_id = str(payload.get("id") or "").strip()
    if not item_id:
        return {"ok": False, "error": "Missing item id"}

    owner = payload.get("owner")
    note = payload.get("note")
    status = payload.get("status")
    archived = payload.get("archived")
    snoozed_until = payload.get("snoozed_until")
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
                            if archived:
                                c["snoozed_until"] = ""
                        if snoozed_until is not None:
                            c["snoozed_until"] = str(snoozed_until)
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
        if clean_path in ("/compagni", "/er-piotta/compagni"):
            self.send_response(302)
            self.send_header("Location", "/compagni/")
            self.end_headers()
            return
        if clean_path.startswith("/compagni/") or clean_path.startswith("/er-piotta/compagni/"):
            rel = clean_path.split("/compagni/", 1)[1]
            if not rel or rel == "index.html":
                rel = "compagni.html"
            target = os.path.realpath(os.path.join(PVT_FACE_CROPS_DIR, rel))
            if not target.startswith(os.path.realpath(PVT_FACE_CROPS_DIR)) or not os.path.isfile(target):
                return self.send_error(404, "Compagni resource not found")
            ctype = self.guess_type(target)
            with open(target, "rb") as f:
                data = f.read()
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(data)
            return
        if clean_path in ("/api/mobile-feed", "/er-piotta/api/mobile-feed"):
            items = []
            if os.path.exists(FEED_JSON_PATH):
                try:
                    with _feed_lock:
                        with open(FEED_JSON_PATH, "r", encoding="utf-8") as f:
                            items = json.load(f)
                except Exception as e:
                    return self._send_json(500, {"ok": False, "error": str(e)})
            logs_path = os.path.join(PVT_ROOT, "data", "piotta_kid_logs.json")
            kid_logs = []
            if os.path.exists(logs_path):
                try:
                    with open(logs_path, "r", encoding="utf-8") as f:
                        kid_logs = json.load(f)
                except Exception:
                    kid_logs = []
            return self._send_json(200, {
                "ok": True,
                "last_synced_at": _get_last_synced_iso(items),
                "items": items,
                "kid_logs": kid_logs,
            })

        if clean_path in ("/api/tickets-state", "/er-piotta/api/tickets-state"):
            state_map = {}
            items = []
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
            return self._send_json(200, {
                "ok": True,
                "last_synced_at": _get_last_synced_iso(items),
                "states": state_map,
            })
        return super().do_GET()

    def do_POST(self):
        clean_path = self.path.split("?", 1)[0]
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"
        try:
            payload = json.loads(raw) if raw.strip() else {}
        except Exception:
            payload = {}

        if clean_path in ("/api/save", "/compagni/api/save", "/api/seby/save", "/compagni/api/seby/save"):
            is_seby = "seby" in clean_path
            assigned_fn = "seby_assigned_faces.json" if is_seby else "assigned_faces.json"
            faces_fn = "seby_faces_data.json" if is_seby else "faces_data.json"
            try:
                data = payload if isinstance(payload, list) else []
                with open(os.path.join(PVT_FACE_CROPS_DIR, assigned_fn), "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                faces_path = os.path.join(PVT_FACE_CROPS_DIR, faces_fn)
                if os.path.exists(faces_path):
                    with open(faces_path, "r", encoding="utf-8") as f:
                        faces = json.load(f)
                    dmap = {item.get("face_id"): item for item in data}
                    for face in faces:
                        fid = face.get("face_id")
                        if fid in dmap:
                            face["assigned_name"] = dmap[fid].get("assigned_name", "")
                            face["color"] = dmap[fid].get("color", "")
                    with open(faces_path, "w", encoding="utf-8") as f:
                        json.dump(faces, f, indent=2, ensure_ascii=False)
                return self._send_json(200, {"status": "ok", "saved_count": len(data)})
            except Exception as e:
                return self._send_json(500, {"error": str(e)})

        if clean_path in ("/api/ticket", "/er-piotta/api/ticket"):
            res = _update_feed_and_firestore(payload)
            return self._send_json(200 if res.get("ok") else 400, res)

        if clean_path in ("/api/piotta-log", "/er-piotta/api/piotta-log"):
            kid = str(payload.get("kid") or "A+S").strip()
            topic = str(payload.get("topic") or "Altro").strip()
            subtopic = str(payload.get("subtopic") or "").strip()
            text = str(payload.get("text") or "").strip()
            score = str(payload.get("score") or "").strip()
            author = str(payload.get("author") or "Riccardo").strip()
            item_id = str(payload.get("item_id") or "").strip()
            sync_septober = bool(payload.get("sync_septober", False))
            if not text:
                return self._send_json(400, {"ok": False, "error": "Missing text"})

            now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
            entry = {
                "id": f"log_{int(datetime.datetime.now().timestamp() * 1000)}",
                "timestamp": now_iso,
                "kid": kid,
                "topic": topic,
                "subtopic": subtopic,
                "text": text,
                "score": score,
                "item_id": item_id,
                "author": author,
                "septober_link": str(payload.get("septober_link") or "").strip(),
            }
            if sync_septober:
                sept_cli = os.path.expanduser("~/git/septober/bin/septober-cli-26")
                if os.path.exists(sept_cli):
                    title_parts = [f"[Tandem][{kid}][{topic}]"]
                    if subtopic:
                        title_parts.append(f"[{subtopic}]")
                    title_parts.append(text)
                    if score:
                        title_parts.append(f"({score})")
                    try:
                        proc = subprocess.run(
                            ["python3", sept_cli, "--agent", "piotta", "add", "--title", " ".join(title_parts)],
                            capture_output=True, text=True, timeout=15, check=False,
                        )
                        if proc.returncode == 0:
                            entry["septober_link"] = "septober://synced"
                    except Exception:
                        pass

            logs_path = os.path.join(PVT_ROOT, "data", "piotta_kid_logs.json")
            os.makedirs(os.path.dirname(logs_path), exist_ok=True)
            existing_logs = []
            if os.path.exists(logs_path):
                try:
                    with open(logs_path, "r", encoding="utf-8") as f:
                        existing_logs = json.load(f)
                except Exception:
                    existing_logs = []
            existing_logs.insert(0, entry)
            with open(logs_path, "w", encoding="utf-8") as f:
                json.dump(existing_logs, f, indent=2, ensure_ascii=False)
            return self._send_json(200, {"ok": True, "entry": entry})

        if clean_path in ("/api/ask-ai", "/er-piotta/api/ask-ai"):
            res = _answer_ai_question(str(payload.get("query") or ""))
            return self._send_json(200 if res.get("ok") else 400, res)

        if clean_path in ("/api/tts", "/er-piotta/api/tts"):
            text = str(payload.get("text") or "").strip()
            voice = str(payload.get("voice") or "Puck").strip()
            if not text:
                return self._send_json(400, {"ok": False, "error": "Missing text"})
            import hashlib, base64, wave, io, urllib.request, urllib.error
            cache_key = hashlib.sha1(f"{voice}:{text}".encode("utf-8")).hexdigest()[:16]
            wav_path = f"/tmp/er_piotta_tts_{cache_key}.wav"
            if not os.path.exists(wav_path) or os.path.getsize(wav_path) < 100:
                api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY") or ""
                if not api_key:
                    return self._send_json(502, {"ok": False, "error": "Missing GEMINI_API_KEY"})
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key={api_key}"
                req_body = json.dumps({
                    "contents": [{"parts": [{"text": f"Leggi in modo caldo, naturale e amichevole in italiano: {text}"}]}],
                    "generationConfig": {
                        "responseModalities": ["AUDIO"],
                        "speechConfig": {
                            "voiceConfig": {
                                "prebuiltVoiceConfig": {"voiceName": voice}
                            }
                        }
                    }
                }).encode("utf-8")
                req = urllib.request.Request(url, data=req_body, headers={"Content-Type": "application/json"}, method="POST")
                try:
                    with urllib.request.urlopen(req, timeout=25) as resp:
                        data = json.loads(resp.read().decode("utf-8"))
                    b64_audio = data["candidates"][0]["content"]["parts"][0]["inlineData"]["data"]
                    raw_pcm = base64.b64decode(b64_audio)
                    with wave.open(wav_path, "wb") as wf:
                        wf.setnchannels(1)
                        wf.setsampwidth(2)
                        wf.setframerate(24000)
                        wf.writeframes(raw_pcm)
                except urllib.error.HTTPError as e:
                    err_body = e.read().decode("utf-8", errors="ignore")[-300:]
                    return self._send_json(502, {"ok": False, "error": f"HTTP {e.code}: {err_body}"})
                except Exception as e:
                    return self._send_json(502, {"ok": False, "error": str(e)})
            with open(wav_path, "rb") as f:
                wav_bytes = f.read()
            self.send_response(200)
            self.send_header("Content-Type", "audio/wav")
            self.send_header("Content-Length", str(len(wav_bytes)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(wav_bytes)
            return

        if clean_path in ("/api/sync", "/er-piotta/api/sync"):
            try:
                proc = subprocess.run(
                    [PVT_CLI, "sync"],
                    cwd=PVT_ROOT,
                    capture_output=True,
                    text=True,
                    timeout=90,
                    check=False,
                )
                subprocess.run(["npm", "run", "build"], cwd=REPO_DIR, timeout=45, check=False)
                return self._send_json(200, {
                    "ok": proc.returncode == 0,
                    "last_synced_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                    "output": (proc.stdout or "")[-600:],
                })
            except Exception as e:
                return self._send_json(500, {"ok": False, "error": str(e)})

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
