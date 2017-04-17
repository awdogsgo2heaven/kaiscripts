import * as nodemailer from 'nodemailer';
import * as sesTransport from 'nodemailer-ses-transport';
import { EmailTemplate } from 'email-templates';
import * as BlueBird from 'bluebird';
import { logger } from '../helpers/logger';
import * as path from 'path';

export default class EmailService {

  public static transporter: nodemailer.Transporter = nodemailer.createTransport(sesTransport({
    accessKeyId: process.env.SMTP_USERNAME,
    secretAccessKey: process.env.SMTP_PASSWORD,
    rateLimit: 5 // do not send more than 5 messages in a second
  }));

  constructor() {

  }
  // load aws sdk

  static async sendVerify(address: string, code: string) {
    // setup e-mail data with unicode symbols


    var templateDir = path.join(__dirname, 'templates', 'verify')

    var template = new EmailTemplate(templateDir);

    var data = {
      verifyCode: code
    }

    return new BlueBird(function (resolve, reject) {
      template.render(data, function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result);
      })

    }).then(function (result: EmailTemplateResults) {

      var mailOptions = {
        from: 'KaiScript Team <noreply@example.com>', // sender address
        to: address, // list of receivers
        subject: 'Verify Device', // Subject line
        html: result.html,
        text: result.text
      };

      return EmailService.transporter.sendMail(mailOptions);

    }).catch(function (e) {
      logger.error(e);
      throw e;
    })

  }

}