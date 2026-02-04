# Collaborative Code Editor Backend

This is the **backend server** for a real-time collaborative code editor.
It handles **WebSocket communication**, **room management**, **language synchronization**, and **remote code execution** using an external compiler API.

---

## Tech Stack

* **Node.js**
* **Express.js**
* **Socket.IO**
* **Axios**
* **HTTP Server**
* **RapidAPI – Online Code Compiler**

---

## Features

* 🔗 Room-based WebSocket communication
* 👥 Multi-user collaboration per room
* 🔄 Real-time code synchronization
* 🌐 Shared language selection per room
* ▶️ Code execution via REST API
* 📡 Broadcast user presence updates
* 🧠 In-memory room & state management

---

## Server Responsibilities

### 1. WebSocket Handling

* User join/leave tracking
* Broadcasting code changes
* Synchronizing language selection
* Managing connected users per room

### 2. Code Execution API

* Accepts source code, language, and input
* Forwards execution request to compiler service
* Returns program output to client

---

## Project Structure

```
.
├── server.js          # Express + Socket.IO server
├── package.json
└── README.md
```

---

## Installation

```bash
npm install
```

---

## Running the Server

```bash
node server.js
```

Server runs on:

```
http://localhost:3001
```

---

## REST API

### `POST /run`

Executes code remotely.

#### Request Body

```json
{
  "code": "print('Hello World')",
  "input": "",
  "lang": "python3"
}
```

#### Response

```json
{
  "output": "Hello World\n"
}
```

---

## WebSocket Events

### `join-room`

**Client → Server**

```json
{
  "roomId": "abc123",
  "username": "Aryan"
}
```

* Creates room if it doesn’t exist
* Adds user to room
* Broadcasts user list and selected language

---

### `user-joined`

**Server → Clients**

Notifies existing users when someone joins.

---

### `connected-users`

**Server → Clients**

```json
{
  "users": ["Aryan", "Alex"],
  "lang": "python3"
}
```

---

### `text-change`

**Bi-directional**

Broadcasts live code changes to all users in the room.

---

### `lang-select`

**Bi-directional**

Synchronizes selected programming language across the room.

---

## In-Memory State

```js
roomUsers = {
  roomId: [{ id, username }]
}

roomLang = {
  roomId: "python3"
}
```

> ⚠️ State resets on server restart.

---

## CORS Configuration

```js
cors: {
  origin: "*",
  methods: ["GET", "POST"]
}
```

Allows cross-origin connections from frontend clients.

---

## Why This Backend?

This backend demonstrates:

* Real-time systems with WebSockets
* Room-based collaboration architecture
* Stateful server design
* Clean separation of REST & WebSocket responsibilities

---

## Future Improvements

* Handle user disconnects
* Persist room state (Redis)
* Add authentication & roles
* Add execution queue & limits
* Support multiple compiler backends
