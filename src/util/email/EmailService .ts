import nodemailer, { Transporter } from "nodemailer";

export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Altere para o host do seu provedor
      port: 587, // Porta do servidor SMTP (normalmente 587 para TLS ou 465 para SSL)
      secure: false, // Use true para SSL, false para TLS
      auth: {
        user: "projetosdiasdev@gmail.com", // Seu usuário de e-mail
        pass: "gubb gcgp xlpu mmlp", // Sua senha ou App Password
      },
    });
  }

  async sendEmail(
    from: string, 
    to: string,
    subject: string,
    text: string,
    html?: string
  ): Promise<void> {
    try {

      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        text,
        html, // Opcional: HTML do corpo do e-mail
      });

      console.log("E-mail enviado: %s", info.messageId);
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      throw error;
    }
  }
}
