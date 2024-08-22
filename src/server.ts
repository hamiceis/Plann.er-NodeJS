import fastify from "fastify"
import { validatorCompiler, serializerCompiler } from "fastify-type-provider-zod"
import cors from "@fastify/cors"

import { createTrip } from "./routes/create-trip"
import { confirmTrip } from "./routes/confim-trip"

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createTrip)
app.register(confirmTrip)

app.register(cors, {
  origin: "*"
})


app.listen({ port: 3333}).then(() => {
  console.log('Server is running')
})