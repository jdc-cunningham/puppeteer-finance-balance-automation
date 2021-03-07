// based on https://isd-soft.com/tech_blog/accessing-google-apis-using-service-account-node-js/
// requires service account configured with key
// also have to share spreadsheet with your service account email

require('dotenv').config({
  path: __dirname + '/.env'
});

const { google } = require('googleapis');
const privateKey = require(`./${process.env.PRIVATE_KEY_JSON_PATH}`);
const sheets = google.sheets('v4');

const jwtClient = new google.auth.JWT(
  privateKey.client_email,
  null,
  privateKey.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

const authenticate = async () => {
  return new Promise(resolve => {
    jwtClient.authorize(function (err, tokens) {
      resolve(!err);
    });
  });
};

// straight outta SO
// https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
// https://stackoverflow.com/a/17306966/2710227
const getTodaysDate = () => {
  var d = new Date(),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2) 
    month = '0' + month;
  if (day.length < 2) 
    day = '0' + day;

  return [month, day, year].join('/');
};

// this returns for example A13
const getEmptyRow = async () => {
  return new Promise(resolve => {
    sheets.spreadsheets.values.get({
        auth: jwtClient,
        spreadsheetId: process.env.SHEET_ID,
        range: `${process.env.TAB_NAME}!A12:A1000` // future problem, past 1000 lol that's far like 27 years if ran thrice a month
    }, (err, res) => {
      if (err) {
        resolve(false);
      } else {
        if (res.data) {
          const lastRow = 12 + res.data.values.length;
          resolve(`A${lastRow}`);
        } else {
          resolve(false);
        }
      }
    });
  });
}

const rightAlignCells = async (rowNum) => {
  // https://stackoverflow.com/a/63538743/2710227
  // get sheetId first
  const sheetIdRequest = {
      spreadsheetId: process.env.SHEET_ID,
      ranges: 'A12:A1000',
      includeGridData: false,  
      auth: jwtClient,
  };

  const sheetIdReqRes = await sheets.spreadsheets.get(sheetIdRequest);
  
  // https://stackoverflow.com/a/58965237/2710227
  // https://stackoverflow.com/questions/42745633/updatecellsrequest-range-not-behaving-as-expected
  const request = {
    requests: [
      {
        repeatCell: {
          range: {
            sheetId: sheetIdReqRes.data.sheets[0].properties.sheetId,
            startRowIndex: rowNum - 1,
            endRowIndex: rowNum,
            startColumnIndex: 0,
            endColumnIndex: 24 // exclusive
          },
          cell: {
            userEnteredFormat: {
              horizontalAlignment: "RIGHT"
            },
          },
          fields: "userEnteredFormat"
        }
      }
    ]
  };

  sheets.spreadsheets.batchUpdate(
    {
      requestBody: request,
      auth: jwtClient,
      spreadsheetId: process.env.SHEET_ID,
    },
    (err, res) => {
      if (err) {
        // handle error
      } else {
        // doesn't have to do anything
      }
    }
  );
}

/**
 * look at this, a docblock!
 * @param {array} payload the values to be entered matching spreadsheet column count
 * // reference: https://developers.google.com/sheets/api/guides/values
 */
const writeToSheet = async (payload) => {
  const authenticated = await authenticate();

  return new Promise(async (resolve) => {
    if (authenticated) {
      const lastRow =  await getEmptyRow(); // eg. A13
      const lastRowLetter = lastRow[0];
      const rowNum = lastRow.split(lastRowLetter)[1];

      payload.unshift(getTodaysDate());

      const values = [
        payload
      ];

      const resource = {
        values
      };

      // future problem, past 1000 lol that's far like 27 years if ran thrice a month
      const range = `${process.env.TAB_NAME}!${lastRow}:X${rowNum}`;

      sheets.spreadsheets.values.update({
        auth: jwtClient,
        spreadsheetId: process.env.SHEET_ID,
        range,
        resource,
        valueInputOption: 'RAW',
      }, (err, res) => {
        if (err) {
          // handle this err
        } else {
          rightAlignCells(rowNum);
        }
      });
    } else {
      resolve(false);
    }
  });
}

module.exports = {
  writeToSheet
};