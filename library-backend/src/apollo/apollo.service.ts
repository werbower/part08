import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { typeDefs } from "./schema.js"
import { resolvers } from "./resolvers.js"
import { IUser } from "../mongo/models.js"
import { getUserFromAuthHeader } from "../mongo/mongo.service.js"


export type AppoloContext = { currentUser: IUser|null }
const server = new ApolloServer<AppoloContext>({
  typeDefs,
  resolvers,
})

export const startApollo = async () => {

  return startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      const auth = req.headers.authorization as string
      const val = await getUserFromAuthHeader(auth)
      return { currentUser: val}
    },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })

}


