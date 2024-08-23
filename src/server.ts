import fastify from "fastify"
import { validatorCompiler, serializerCompiler } from "fastify-type-provider-zod"
import cors from "@fastify/cors"

import { createTrip } from "./routes/create-trip"
import { confirmTrip } from "./routes/confim-trip"
import { confirmParticipants } from "./routes/confirm-participant"

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipants)

app.register(cors, {
  origin: "*"
})


app.listen({ port: 3333}).then(() => {
  console.log('Server is running')
})