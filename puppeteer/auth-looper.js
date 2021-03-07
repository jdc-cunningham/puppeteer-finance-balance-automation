const axios = require('axios').default;

const callApi = async (callCount, acctHash, resolve) => {
  callCount += 1;
  if (callCount === 119) {
    resolve(false); // last attempt
    return;
  }

  axios.get(process.env.TWILIO_2FA_PATH + `/get-auth-code/${acctHash}`)
    .then((response) => {
      if (response.status === 200 && response.data) {
        if (response.data) {
          resolve(response.data);
        } else {
          setTimeout(() => {
            callApi(callCount, acctHash, resolve);
          }, 5000);
        }
      } else {
        setTimeout(() => {
          callApi(callCount, acctHash, resolve);
        }, 5000);
      }
    })
    .catch((err) => {
      // keep trying?
      setTimeout(() => {
        callApi(callCount, acctHash, resolve);
      }, 5000);
    });
};

const getAuthCode = async (attempts, acctHash) => {
  return new Promise(resolve => {
    callApi(attempts, acctHash, resolve);
  });
};

module.exports = {
  getAuthCode
};