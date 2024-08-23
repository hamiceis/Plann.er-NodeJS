import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { dayjs } from "../lib/dayjs";
import nodemailer from "nodemailer"

import { getMailClient } from "../lib/mail";
import { prisma } from "../lib/prisma";

export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId/confirm",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
        include: {
          participants: {
            where: {
              is_owner: false,
            },
          },
        },
      });

      if (!trip) {
        throw new Error("Trip not found");
      }

      if (trip.is_confirmed) {
        return reply.redirect(`http://localhost:3000/trips/${tripId}`);
      }

      await prisma.trip.update({
        where: {
          id: tripId,
        },
        data: {
          is_confirmed: true,
        },
      });

      const formattedStartsDate = dayjs(trip.starts_at).format("LL");
      const formattedEndsDate = dayjs(trip.ends_at).format("LL");

      

      const mail = await getMailClient();

      await Promise.all(
        trip.participants.map(async (participant) => {
          const confirmationLink = `http://localhost:3333/participants/confirm/${participant.id}`

          const message = await mail.sendMail({
            from: {
              name: "Equipe plann.er",
              address: "plann.er@equipe.com",
            },
            to: participant.email,
            subject: `Você foi convidado(a) na viagem para ${trip.destination} em ${formattedStartsDate}`,
            html: `
          <div>
          <p style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
          Você solicitou a criação de uma viagem para <strong>${trip.destination}</strong>, nas datas de <strong> ${formattedStartsDate} </strong>
          a <strong>${formattedEndsDate}</strong> </p>
          <p></p>
          <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
          <p></p>
          <p>
           <a href='${confirmationLink}' target="_blank">Confimar viagem</a>
          </p>
          <p></p>
          <p>Caso você bão saiba do que se trata esse e-mail, apenas ignore esse e-mail</p>
          </div>
        `.trim(),
          })
          
          console.log("LINK DO CONVITE", nodemailer.getTestMessageUrl(message))
        })
      );

      return reply.redirect(`http://localhost:3000/trips/${tripId}`)      
    }
  );
}
