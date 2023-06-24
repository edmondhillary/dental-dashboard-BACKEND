import twilio from 'twilio';

const accountSid ='AC731b206fe2ba3c2e1ce7da83e094475e' ;
const authToken ='f44713a83e551f1d1fd905c976081e1f' ;

const client = twilio(accountSid, authToken);

client.messages
  .create({
    body: 'Hs reservado una cita en la clinica dental Lorenzo gonzalez, een Manuel Candela 6 pta 1 a las 17h el proximo 1 de julio 2023?',
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+34617680026'
  })
  .then(message => console.log(message.sid));
 