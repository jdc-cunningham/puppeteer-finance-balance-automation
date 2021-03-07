require('dotenv').config();
const { pool } = require('./dbConnect');

// this will be filled in automatically during the login process
// this is just filling the table as you will have to add this when you add more processes
const _addAcctHash = (acctHash) => {
  pool.query(
    `INSERT INTO auth_codes SET acct_hash = ?, 2fa_code = ?`,
    [acctHash, ''],
    (err, res) => {
      if (err) {
        console.log('failed to add new acct hash', err);
      } else {
        console.log(`hash created with ID: ${res.insertId}`);
      }
    }
);
}

// example call
_addAcctHash('bofa');