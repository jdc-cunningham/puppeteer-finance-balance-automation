### Tasks
#### Automate the logins
- [ ] write all access processes
- [ ] deal with 2FA pages
  - [ ] using Twilio service as mobile app prompt
      - [ ] setup loop on node Puppeteer login side to check for updates from Twilio with auth code availability so the current login process can wait/interact with the page when the data is ready.
  - [ ] write per site

#### Google Spreadsheet
- [ ] do Google Spreadsheet server-side writing
  - [ ] figure out how to do the drag-rules programmatically
    - well... I can just copy the commands and run them on server side

#### Deploy
- [ ] stand up eg. setup on server
  - specify when it runs, guess I could just use CRON

### The Twilio get 2FA auth code
The process will go like this:

* Puppeteer tries to login to some acct, 2FA prompt happens
* the acct script will verify/accept the 2FA method eg. text (avoid call method, I never use that)
* then it will hit up my Twilio node API url with a request like https://mydomain.com/expect-auth-code/bofa
* that'll result in two text messages, the one from the 2FA acct and one from my Twilio service
* I'll see the acct being requested and respond to it(Twilio) then Twilio will update the db row
* then the waiting loop will try and fetch data from https://mydomain.com/get-auth-code/bofa
* once the code has been retrieved, script continues interacting with 2FA page by entering the code and proceeding
* get balance and update spreadsheet
* this process/acct is done close browser

OMG I forgot how my own code works lol how the DNS routes for the subdomain to a node app running by systemd

