import { ApolloServer } from "@apollo/server"

import { typeDefs } from "./schema.js"
import { resolvers } from "./resolvers.js"
import { IUser } from "../mongo/models.js"
import { getUserFromAuthHeader } from "../mongo/mongo.service.js"
import express from 'express'

import { makeExecutableSchema } from "@graphql-tools/schema"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import cors from 'cors'
import { expressMiddleware } from "@as-integrations/express5"
import { useServer } from "graphql-ws/use/ws"
import { WebSocketServer } from 'ws'
import { createServer } from "http"
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"


export type AppoloContext = { currentUser: IUser|null }

export const startApollo = async (port: number) => {
  const app = express()
  const httpServer = createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/'
  })

  const schema = makeExecutableSchema({typeDefs, resolvers})
  const serverCleanup = useServer({schema}, wsServer)

  const server = new ApolloServer<AppoloContext>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({httpServer}),
      {async serverWillStart() {
        return { async drainServer() {
          await serverCleanup.dispose()
        }}
      }},
      ApolloServerPluginLandingPageLocalDefault({
        footer: false,
        embed: {
          endpointIsEditable: true
        }
      })
    ],
  })

  await server.start()
  app.use('/',
    cors(),
    express.json(),
    expressMiddleware(server, {
          context: async ({ req }) => {
      const auth = req.headers.authorization as string
      const val = await getUserFromAuthHeader(auth)
      return { currentUser: val}
    },
    })
  )
  
  httpServer.listen(port, ()=> {
    console.log(`servert is running on http://localhost:${port}`)
  })
}


