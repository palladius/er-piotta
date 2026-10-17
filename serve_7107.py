import http.server
import socketserver
import os
import sys

PORT = 7107
DIST_DIR = '/home/riccardo/git/er-piotta/dist'

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def do_GET(self):
        # Redirect root / or /index.html directly to tickets feed
        if self.path in ['', '/', '/index.html']:
            self.send_response(302)
            self.send_header('Location', '/er-piotta/tickets/')
            self.end_headers()
            return
        super().do_GET()

# Ensure dist/er-piotta exists as a symlink to dist itself so both / and /er-piotta paths resolve
er_piotta_link = os.path.join(DIST_DIR, 'er-piotta')
if not os.path.exists(er_piotta_link):
    try:
        os.symlink('.', er_piotta_link)
    except Exception as e:
        print("Symlink info:", e)

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

with ReusableTCPServer(('0.0.0.0', PORT), Handler) as httpd:
    print(f'Server listening on http://0.0.0.0:{PORT} (Auto-redirecting / to /er-piotta/tickets/)')
    httpd.serve_forever()
