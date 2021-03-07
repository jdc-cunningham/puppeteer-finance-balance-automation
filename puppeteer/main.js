const { getBofaBalance } = require('./accts/bofa/bofa.js');

const getAcctBalances = async () => {
  const bofaBalance = await getBofaBalance();
  console.log('bofa', bofaBalance);
};

getAcctBalances();