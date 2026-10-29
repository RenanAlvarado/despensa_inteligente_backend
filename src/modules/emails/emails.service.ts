import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailsService {
  private readonly resend: Resend;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(
      this.configService.getOrThrow<string>('RESEND_API_KEY'),
    );

    this.from = this.configService.getOrThrow<string>('EMAIL_FROM');
  }

  // Envia o código de confirmação de e-mail.
  async sendVerificationCode(recipient: string, code: string): Promise<void> {
    const expirationMinutes = this.configService.getOrThrow<number>(
      'VERIFICATION_CODE_EXPIRATION_MINUTES',
    );

    const { error } = await this.resend.emails.send({
      from: this.from,
      to: recipient,
      subject: 'Confirme seu e-mail | Despensa Inteligente',

      text: [
        'DESPENSA INTELIGENTE',
        '',
        'Confirme seu e-mail',
        '',
        'Estamos quase prontos! Utilize o código abaixo para confirmar seu endereço de e-mail.',
        '',
        `Seu código: ${code}`,
        '',
        `Este código expira em ${expirationMinutes} minutos.`,
        'Por segurança, não compartilhe este código com ninguém.',
        '',
        'Se você não criou uma conta no Despensa Inteligente, ignore este e-mail.',
        '',
        'Despensa Inteligente | Organização para o seu dia a dia.',
      ].join('\n'),

      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="color-scheme" content="light" />
            <meta name="supported-color-schemes" content="light" />
            <title>Confirme seu e-mail</title>
          </head>

          <body style="
            margin: 0;
            padding: 0;
            background-color: #f3f6f4;
            font-family: Arial, Helvetica, sans-serif;
            color: #24332b;
          ">
            <table
              role="presentation"
              width="100%"
              cellspacing="0"
              cellpadding="0"
              border="0"
              style="background-color: #f3f6f4; padding: 32px 12px;"
            >
              <tr>
                <td align="center">
                  <table
                    role="presentation"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    style="
                      max-width: 560px;
                      background-color: #ffffff;
                      border-radius: 16px;
                      overflow: hidden;
                      border: 1px solid #e3eae5;
                    "
                  >
                    <!-- Cabeçalho -->
                    <tr>
                      <td style="
                        background-color: #176b45;
                        padding: 28px 24px;
                        text-align: center;
                      ">
                        <p style="
                          margin: 0;
                          color: #ffffff;
                          font-size: 22px;
                          line-height: 1.4;
                          font-weight: bold;
                          letter-spacing: 0.3px;
                        ">
                          Despensa Inteligente
                        </p>

                        <p style="
                          margin: 6px 0 0;
                          color: #d8f3e3;
                          font-size: 13px;
                          line-height: 1.5;
                        ">
                          Mais organização para o seu dia a dia.
                        </p>
                      </td>
                    </tr>

                    <!-- Conteúdo -->
                    <tr>
                      <td style="padding: 36px 28px 24px;">
                        <p style="
                          margin: 0 0 10px;
                          color: #176b45;
                          font-size: 12px;
                          font-weight: bold;
                          letter-spacing: 1.5px;
                          text-transform: uppercase;
                        ">
                          CONFIRMAÇÃO DE CONTA
                        </p>

                        <h1 style="
                          margin: 0 0 16px;
                          color: #24332b;
                          font-size: 26px;
                          line-height: 1.3;
                          font-weight: 700;
                        ">
                          Vamos confirmar seu e-mail?
                        </h1>

                        <p style="
                          margin: 0 0 24px;
                          color: #59665e;
                          font-size: 15px;
                          line-height: 1.8;
                        ">
                          Olá! Obrigado por se cadastrar no
                          <strong>Despensa Inteligente</strong>.
                          Para concluir a criação da sua conta, utilize
                          o código de confirmação abaixo.
                        </p>

                        <!-- Cartão do código -->
                        <table
                          role="presentation"
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                          style="
                            background-color: #f0f8f3;
                            border: 1px solid #d6eadc;
                            border-radius: 12px;
                          "
                        >
                          <tr>
                            <td align="center" style="padding: 24px 12px;">
                              <p style="
                                margin: 0 0 12px;
                                color: #59665e;
                                font-size: 13px;
                                line-height: 1.5;
                              ">
                                SEU CÓDIGO DE CONFIRMAÇÃO
                              </p>

                              <p style="
                                margin: 0;
                                color: #176b45;
                                font-family: Arial, Helvetica, sans-serif;
                                font-size: 34px;
                                line-height: 1.4;
                                font-weight: bold;
                                letter-spacing: 8px;
                              ">
                                ${code}
                              </p>

                              <p style="
                                margin: 12px 0 0;
                                color: #59665e;
                                font-size: 12px;
                                line-height: 1.5;
                              ">
                                Este código expira em 10 minutos.
                              </p>
                            </td>
                          </tr>
                        </table>

                        <p style="
                          margin: 24px 0 0;
                          color: #59665e;
                          font-size: 14px;
                          line-height: 1.8;
                        ">
                          <strong style="color: #24332b;">Importante:</strong>
                          por segurança, não compartilhe este código com ninguém.
                        </p>

                        <p style="
                          margin: 18px 0 0;
                          color: #59665e;
                          font-size: 14px;
                          line-height: 1.8;
                        ">
                          Se você não criou uma conta no Despensa Inteligente,
                          pode ignorar este e-mail. Nenhuma ação será necessária.
                        </p>
                      </td>
                    </tr>

                    <!-- Rodapé -->
                    <tr>
                      <td style="
                        padding: 22px 28px;
                        background-color: #f8faf8;
                        border-top: 1px solid #e8eee9;
                        text-align: center;
                      ">
                        <p style="
                          margin: 0;
                          color: #59665e;
                          font-size: 12px;
                          line-height: 1.7;
                        ">
                          Este é um e-mail automático. Por favor, não responda.
                        </p>

                        <p style="
                          margin: 8px 0 0;
                          color: #176b45;
                          font-size: 12px;
                          font-weight: bold;
                        ">
                          Despensa Inteligente
                        </p>

                        <p style="
                          margin: 6px 0 0;
                          color: #8a968e;
                          font-size: 11px;
                          line-height: 1.6;
                        ">
                          Organização, praticidade e controle na sua despensa.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="
                    max-width: 500px;
                    margin: 18px 12px 0;
                    color: #8a968e;
                    font-size: 11px;
                    line-height: 1.6;
                    text-align: center;
                  ">
                    Você recebeu esta mensagem porque um cadastro foi solicitado
                    com este endereço de e-mail.
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      throw new InternalServerErrorException(
        'Não foi possível enviar o e-mail de confirmação.',
      );
    }
  }
}
