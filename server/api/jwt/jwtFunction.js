/*
Project name: Commit Message Bot
Written by: Phillip Tat
Date written: 10/17/21
For: UCF Senior Design Project
Purpose: Website for github bot users to see their levels, total experience earned,
commit message data, and send anonymous messages.
*/
const fs   = require('fs');
const jwt   = require('jsonwebtoken');

// use 'utf8' to get string instead of byte array
let privateKEY  = fs.readFileSync('./config/private.key', 'utf8');
let publicKEY  = fs.readFileSync('./config/public.key', 'utf8');

module.exports = {
  sign: (payload) => {
    // Token signing options
    let signOptions = {
      issuer: "GitBotUser",
      expiresIn: "1h",
      algorithm: "RS256"
    };

    return jwt.sign(payload, privateKEY, signOptions);
  },

  verify: (token) => {
    let verifyOptions = {
      issuer: "GitBotUser",
      expiresIn: "1h",
      algorithm: ["RS256"]
    };
    try {
      return jwt.verify(token, publicKEY, verifyOptions);
    }
    catch (err) {
      return false;
    }
  },

  decode: (token) => {
    return jwt.decode(token, {complete: true});
    //returns null if token is invalid
  }
}
