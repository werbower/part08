import { startApollo } from "./apollo/apollo.service.js"
import { connectDB } from "./mongo/mongo.service.js"


await connectDB()
await startApollo()
