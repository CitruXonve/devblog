---
title: Advanced Coding Interview Involving Concurrency / Multi-threading / Distributed System Design Topics
tags:
  - Interview
  - React
  - TypeScript
  - network
abbrlink: 8ecb62b2
date: 2025-08-07 16:44:38
---

Ever since 2025, there has been an increasing number of in-depth problems involved in the seemingly resolvable coding interviews, which used to be very uncommon. It's worthwhile noting that being unprepared for such topics but merely showing a problem-solving mindset may not always lead to a desirable passing-level result, given the extremely-competitive job market, while it's also not recommended to learn by rote - memorizing the answer without thorough understanding could be easily recognized as imposter by the interviewers.

## Discord Screen Challenge - Chat Server

### Problem Statement

[Original Problem Statement](https://gist.github.com/vassjozsef/5d76cd7634995c841f683a15d78684c8)

Functional Requirements:

- The chat server should be capable of handling multiple clients connecting at the same time.
- Disconnection should be handled in a clean way.
- Should be able to receive and forward messages among clients (message is not echoed back to sender).

<!--more-->

Original defective implementation during the interview (single incoming connection allowed at a time; keeping blocked until the disconnection), in which the purpose of introducing socket was unclear:

```py
import socketserver

class MyTCPHandler(socketserver.BaseRequestHandler):
    """
    The request handler class for our server.

    It is instantiated once per connection to the server, and must
    override the handle() method to implement communication to the
    client.
    """

    def handle(self):
        while True:
            recv = self.request.recv(2000)
            if len(recv) > 7 and recv[:6] == 'FORWARD':
                pass
            if len(recv) < 1 or recv == '\x03':
                print(f"Disconnected from {self.client_address[0]}.")
                break
            print(f"Received from {self.client_address[0]}:")
            print(recv.decode("utf-8"))

def server_thread():
    # Create the server, binding to localhost on port 9999
    with socketserver.TCPServer((HOST, PORT), MyTCPHandler) as server:
        # Activate the server; this will keep running until you
        # interrupt the program with Ctrl-C
        server.serve_forever()

if __name__ == "__main__":
    HOST, PORT = "localhost", 9999

    import socket
    s = socket.socket()
    s.bind((HOST, PORT))  # bind the socket to the port and ip address

    s.listen(5)  # wait for new connections

    from threading import Thread

    while True:
        c, addr = s.accept()  # Establish connection with client.
        # this returns a new socket object and the IP address of the client
        print(f"New connection from: {addr}")
        thread = Thread(target=server_thread, args=())  # create the thread
        thread.start()

        thread.join()
```

Revised version supporting multiple concurrent connections with multi-threading and simulated clean-up:

```py
import socketserver
import threading
import socket

HOST, PORT = "localhost", 9999

class ThreadedTCPRequestHandler(socketserver.BaseRequestHandler):
    """
    Reusing the single TCP connection handler.
    """

    def handle(self):
        cur_thread = threading.current_thread()
        while True:
            recv = self.request.recv(2000)
            if len(recv) < 1 or recv == '\x03':
                print(f"Disconnected from {self.client_address[0]}.")
                break
            print(f"Received from {self.client_address} handled by {cur_thread.name}:")
            print(recv.decode("utf-8"))

        print('Terminating thread:', cur_thread, '\n')

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    """
    Wrapper class definition.
    """
    pass

def client_socket(ip, port):
    # Without socket binding, the server thread will quit immediately
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.connect((ip, port))
        response = str(sock.recv(1024), 'ascii')
        print("Received: {}".format(response))

def multi_conn_server():
    with ThreadedTCPServer((HOST, PORT), ThreadedTCPRequestHandler) as server:
        ip, port = server.server_address

        # Start a thread with the server -- that thread will then start one
        # more thread for each request
        server_thread = threading.Thread(target=server.serve_forever)
        # Exit the server thread when the main thread terminates
        server_thread.daemon = True
        server_thread.start()
        print(f"Server listening at {ip}:{port}")
        print("Server loop running in thread:", server_thread.name)

        client_socket(ip, port)

if __name__ == "__main__":
    multi_conn_server()
```

### Testing / Debugging

Once the server-side Python script is running in the CLI, this can be used to simulate client connecting and messaging, as well as disconnecting by `^C`:

```bash
nc [hostname] [port]
```

### Reference

[Non-blocking Multi-threading Solution](https://www.finalroundai.com/interview-questions/discord-tcp-chat-server-build) - this addressed the basic functional requirement, but potentially left the post-disconnection cleanup and message forwarding unhandled.

[Asynchronous Mixins](https://docs.python.org/3/library/socketserver.html#asynchronous-mixins) - native asynchronous handler with examples.
