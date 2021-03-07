require('dotenv').config({
  path: __dirname + '/.env'
});
const { constants } = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
const { pool } = require('./dbConnect');

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

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// routes
app.post('/', (req, res) => {
  const smsBody = req.body.Body; // my Twilio PHP code sends this from Twilio numbers forward to custom url

  // this is an array of strings
  const acctHashes = process.env.ACCT_HASHES.split(',');
  let acctMatched;
  let acctFound = false;

  // originally used some here but need value, not that many accts to run through
  acctHashes.forEach(acct => {
    if (smsBody.indexOf(`${acct}: `) !== -1) {
      acctMatched = acct;
      acctFound = true;
    }
  });

  if (acctFound) {
    const authCode = smsBody.split(`${acctMatched}: `)[1].trim(); // assumes perfectly setup no extra lines

    // this is a check to make sure auth code is an integer when parsed
    // means auth validation would keep running until times out 10mins sucks
    if (!Number.isInteger(parseInt(authCode))) {
      res.status(200).send('');
    }

    pool.query(
      `UPDATE auth_codes SET 2fa_code = ? WHERE acct_hash = ?`,
      [authCode, acctMatched],
      (err, sqlRes) => {
        if (err) {
          res.status(200).send('');
        } else {
          res.status(200).send('auth code updated');
        }
      }
    );
  } else {
    res.status(200).send('');
  }
});

app.get('/',(req, res) => {
  res.status(200).send('live');
});

const removeLastAuthCode = (acct) => {
  pool.query(
    `UPDATE auth_codes SET 2fa_code = '' WHERE acct_hash = ?`,
    [acct],
    (err, sqlRes) => {
      // cool
    }
  );
}

app.get('/get-auth-code/:acct',(req, res) => {
  const acct = req.params['acct'];

  pool.query(
    `SELECT 2fa_code FROM auth_codes WHERE acct_hash = ?`, // ehh "hash"
    [acct],
    (err, qres) => {
      if (err) {
        res.status(200).send(''); // will keep retrying, have to add the accts as processes are added
      } else {
        if (qres.length) {
          removeLastAuthCode(acct); // supposed to be empty until I update it by text response to Twilio
          res.status(200).send(qres[0]['2fa_code']);
        } else {
          res.status(200).send('');
        }
      }
    }
  );
});

if (process.env.NODE_ENV === "live") {
  console.log('live');
  https.createServer(https_options, app).listen(443);
} else {
  app.listen(port, () => {
      console.log(`App running... on port ${port}`);
  });
}