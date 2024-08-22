import nodemailer from "nodemailer"

export async function getMailClient( ) {
  //Isso cria "caixa" para receptar os e-mails enviados para test
  const account  = await nodemailer.createTestAccount()

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email", //host desse serviço de test
    port: 587, //port
    secure: false, // or 'STARTTLS'
    auth: {
      user: account.user,
      pass: account.pass
    } //dados do admin do smtp
  })
  return transporter
}