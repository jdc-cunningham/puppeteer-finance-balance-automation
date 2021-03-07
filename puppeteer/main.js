const { getBofaBalance } = require('./accts/bofa/bofa.js');
const { writeToSheet } = require('../google-spreadsheet-api/writeToSpreadsheet.js');

const getAcctBalances = async () => {
  const bofaBalance = await getBofaBalance();
  const rowVals = [
    '',
    bofaBalance.split('$')[1]
  ]
  writeToSheet(rowVals);
};

getAcctBalances();