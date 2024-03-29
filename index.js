const express = require("express");
const app = express();
const server = require("http").createServer(app);
// const server = http.createServer(app); //Creating a Server
const socketIo = require("socket.io");
const wss = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const axios = require("axios");
const cors = require("cors");
// Middleware for parsing JSON in the request body
app.use(express.json());
// app.use(cors());
const roomUsers = {};
const roomLang = {};
const options = {
  method: "POST",
  url: "https://online-code-compiler.p.rapidapi.com/v1/",
  headers: {
    "content-type": "application/json",
    "X-RapidAPI-Key": "f76498fd92msh7e4481bd63738bap15e366jsnc85e13d85da8",
    "X-RapidAPI-Host": "online-code-compiler.p.rapidapi.com",
  },
  data: {
    language: "python3",
    version: "latest",
    code: 'print("Hello, World!");',
    input: null,
  },
};

app.post("/run", async (req, res) => {
  console.log("hello");
  try {
    const code = req.body.code;
    const input = req.body.input;
    const lang = req.body.lang;
    options.data.code = code;
    options.data.input = input || null;
    options.data.language = lang;

    console.log(options);
    const output = await run();
    res.json({ output });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error executing code" });
  }
});

async function run() {
  console.log("runn");
  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data.output;
  } catch (error) {
    console.error(error);
    // return error;
  }
}
console.log(options);

wss.on("connection", (ws) => {
  console.log("clients connected");
  ws.on("join-room", ({ roomId, username }) => {
    ws.join(roomId);
    console.log("joined room");
    console.log("user is", username);
    if (typeof roomUsers[roomId] === "undefined") {
      console.log(
        `Initializing roomUsers for roomId: ${JSON.stringify(roomId)}`
      );
      roomUsers[roomId] = [];
      roomLang[roomId] = "noLang";
    } else {
      ws.broadcast
        .to(roomId)
        .emit("lang-select", { roomId, lang: roomLang[roomId] });
    }
    const existingUser = roomUsers[roomId].find(
      (user) => user.username === username
    );
    if (!existingUser) {
      roomUsers[roomId].push({ id: ws.id, username });
    }
    ws.broadcast.to(roomId).emit("user-joined", username);
    wss.in(roomId).emit(
      "connected-users",
      roomUsers[roomId].map((user) => user.username)
    );
  });
  ws.on("text-change", ({ roomId, username, data }) => {
    // console.log("code is", data);
    ws.to(roomId).emit("text-change", { roomId, username, data });
  });
  ws.on("lang-select", ({ roomId, lang }) => {
    roomLang[roomId] = lang;
    ws.to(roomId).emit("lang-select", { roomId, lang });
    console.log("language selected to be ", lang);
  });
});

server.listen(3000, () => {
  console.log("listening");
});
