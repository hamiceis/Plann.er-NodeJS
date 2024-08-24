import fastify from "fastify"
import { validatorCompiler, serializerCompiler } from "fastify-type-provider-zod"
import cors from "@fastify/cors"

import { createTrip } from "./routes/create-trip"
import { confirmTrip } from "./routes/confim-trip"
import { confirmParticipants } from "./routes/confirm-participant"
import { createActivities } from "./routes/create-activities"
import { getActivities } from "./routes/get-activities"
import { createlinks } from "./routes/create-links"
import { getLinks } from "./routes/get-links"
import { getParticipants } from './routes/get-participants'
import { createInvite } from "./routes/create-invite"
import { updateTrip } from "./routes/update-trip"
import { getTripDetails } from "./routes/get-trip-details"
import { getParticipant } from "./routes/get-participant"

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipants)
app.register(createActivities)
app.register(getActivities)
app.register(createlinks)
app.register(getLinks)
app.register(getParticipants)
app.register(createInvite)
app.register(updateTrip)
app.register(getTripDetails)
app.register(getParticipant)


app.register(cors, {
  origin: "*"
})


app.listen({ port: 3333}).then(() => {
  console.log('Server is running')
})