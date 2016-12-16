# just run me with python3
import http.server
import socketserver

HOST = '127.0.0.1'
PORT = 8000

httpd = socketserver.TCPServer(
    (HOST, PORT),
    http.server.SimpleHTTPRequestHandler
)

print('http://{}:{}'.format(HOST, PORT))

httpd.serve_forever()
