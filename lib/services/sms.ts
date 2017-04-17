import * as aws from 'aws-sdk';
import * as BlueBird from 'bluebird';
import { logger } from '../helpers/logger';
import * as path from 'path';

aws.config.update({
  accessKeyId: process.env.SMS_USERNAME,
  secretAccessKey: process.env.SMS_PASSWORD,
  region: 'us-east-1'
});
  
export default class SmsService {


  public static sns: aws.SNS = new aws.SNS();
 
  constructor() {

  }
  // load aws sdk

  static async sendVerify(phone: string, code: string) {
    // setup e-mail data with unicode symbols

    var phoneTest = /^\+?[1-9]\d{1,14}$/
    
    if (!phoneTest.test(phone)) {
      throw new Error('Invalid phone number');  
    }

    var params = {
      Message: 'click to verify and join the nexus! \nhttps://www.example.com/verify/' + code, /* required */
      MessageAttributes: {
        MaxPrice: {
          DataType: 'Number', /* required */
          StringValue: '0.01',
          BinaryValue: undefined
        },
        /* anotherKey: ... */
      },
      PhoneNumber: phone,
      Subject: 'Verify Device'
    };

    return new BlueBird(function (resolve, reject) {

      SmsService.sns.publish(params, function(err, data) {
        if (err) {
          reject(err);
        }// an error occurred
        
        resolve(data);
        
         // successful response
      });


    }).catch(function (e) {
      logger.error(e);
      throw e;
    })

  }

}