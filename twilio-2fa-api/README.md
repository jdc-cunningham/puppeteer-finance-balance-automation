### About
This is a mechanism to handle 2FA that can popup on some websites that need to validate your identity.
In my case since I don't have a mobile app with notifications, I'm using Twilio which is a programmable SMS service.
I've been using my Android phone's SMS app as a "mobile app".
This API is the bridge between the automated Puppeteer acct login and me who gets the 2FA auth codes from the website.
I then take the 2FA code, respond to the Twilio number which goes to this API and then this API forwards that auth code to the waiting Puppeteer script.
After the script receives the code, it then continues interacting with the webpage to get the balance.

