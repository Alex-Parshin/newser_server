import socket from "socket.io";

export default function socketManager(server) {
  const io = socket(server);
  io.on("connect", (socket) => {
    socket.emit('confirm', 'Успешное подключение')
    socket.on("disconnect", () => {
      console.log("Клиент отключился!");
    });
  });
}