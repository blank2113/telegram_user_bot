import { io } from "socket.io-client";

export const socket = io("http://localhost:4040", {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  withCredentials: true, // если сервер использует cookie
  // path: "/socket.io", // раскомментируйте если сервер использует нестандартный path
  // autoConnect: true,
});

console.log("[socket] instance created, connected:", socket.connected);

socket.on("connect", () => {
  console.log("[socket] connected, id:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("[socket] disconnected, reason:", reason);
});

socket.on("connect_error", (err) => {
  console.error("[socket] connect_error:", err);
});

socket.on("reconnect_attempt", (count) => {
  console.log("[socket] reconnect_attempt", count);
});
