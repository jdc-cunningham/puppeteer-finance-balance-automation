const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const twilioSid = process.env.TWILIO_SID;
const twilioToken = process.env.TWILIO_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const myPhoneNumber = process.env.MY_PHONE_NUMBER;

const client = require('twilio')(twilioSid, twilioToken);

const twilioSendSms = (msg) => {
  client.messages
    .create({
      body: msg,
      from: twilioPhoneNumber,
      to: myPhoneNumber
    })
    .then(message => console.log(message.sid));
};

module.exports = {
  twilioSendSms
};
