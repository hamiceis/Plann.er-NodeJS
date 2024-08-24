import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from "nodemailer";
import { z } from "zod";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import { prisma } from "../lib/prisma";

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/invites",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;
      const { email } = request.body;
      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });

      if (!trip) {
        throw new Error("Trip not found");
      }

      const participant = await prisma.participant.create({
        data: {
          email,
          trip_id: tripId,
        },
      });

      const formattedStartsDate = dayjs(trip.starts_at).format("LL");
      const formattedEndsDate = dayjs(trip.ends_at).format("LL");

      const confirmationLink = `http://localhost:3333/participants/${participant.id}/confirm`;

      const mail = await getMailClient();

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
      });

      console.log("URL nodemailer --", nodemailer.getTestMessageUrl(message));

      return {
        participantId: participant.id,
      };
    }
  );
}
