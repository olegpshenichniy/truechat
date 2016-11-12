# just run me with python3
import http.server
import socketserver

PORT = 8000

httpd = socketserver.TCPServer(
    ("", PORT),
    http.server.SimpleHTTPRequestHandler
)

httpd.serve_forever()
