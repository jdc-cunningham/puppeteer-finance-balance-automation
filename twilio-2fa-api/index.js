require('dotenv').config({
  path: __dirname + '/.env'
});
const { constants } = require('crypto');
const express = require('express');
const app = express();
const port = 5000;

let https;
let https_options;

// ssl if live
if (process.env.NODE_ENV === "live") {
  https = require('https');
  const fs = require('fs');
  https_options = {
      key: fs.readFileSync(`${process.env.PRIV_KEY_FILE_PATH}`),
      cert: fs.readFileSync(`${process.env.FULL_CHAIN_PEM_FILE_PATH}`),
      secureOptions: constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1,
      ciphers: JSON.parse(fs.readFileSync(`${process.env.CIPHERS_FILE_PATH}`)).join(':'),
  }

  // not working
  // logging - https://stackoverflow.com/questions/8393636/node-log-in-a-file-instead-of-the-console
  const util = require('util');
  const log_file = fs.createWriteStream(process.env.LOG_PATH + '/twilio_2fa_api.log', {flags : 'w'});
  const log_stdout = process.stdout;

  console.log = function(d) { //
      log_file.write(util.format(d) + '\n');
      log_stdout.write(util.format(d) + '\n');
  };
}

// CORs
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// routes
app.post('/', (req, res) => {
  console.log('post');
  res.status(200).send('');
});

app.get('/',(req, res) => {
  res.status(200).send('live');
});

app.get('/get-auth-code/bofa',(req, res) => {
  res.status(200).send('030303');
});

if (process.env.NODE_ENV === "live") {
  console.log('live');
  https.createServer(https_options, app).listen(443);
} else {
  app.listen(port, () => {
      console.log(`App running... on port ${port}`);
  });
}