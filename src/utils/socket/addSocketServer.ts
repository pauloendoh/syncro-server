import { createServer } from "http"

import { config } from "dotenv"
import { Server } from "socket.io"
import { MySocketServer } from "./MySocketServer"
import { socketEvents } from "./socketEvents"
import { socketRooms } from "./socketRooms"
config()

export const addSocketServer = (app?: any) => {
  const httpServer = createServer(app)

  const serverSocket = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  })

  serverSocket.on("connection", (userSocket) => {
    console.log("user connected")

    userSocket.on(socketEvents.joinUserRoom, (userId: string) => {
      userSocket.join(socketRooms.userRoom(userId))
      console.log("User joined room: ", userId)
    })

    userSocket.on(socketEvents.leaveUserRoom, (userId: string) => {
      userSocket.leave(socketRooms.userRoom(userId))
      console.log("User left room: ", userId)
    })
  })

  app.set("socketio", serverSocket)

  MySocketServer.setInstance(serverSocket)

  return httpServer
}
