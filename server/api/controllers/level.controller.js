/*
Project name: GitBot User Website
Written by: Phillip Tat
Date written: 10/17/21
For: UCF Senior Design Project
Purpose: Website for github bot users to see their levels, total experience earned,
and commit message data. (if possible, also send anonymous messages.)
*/
const Level = require("../models/level.model.js");
const jwt = require("../jwt/jwtFunction.js");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const Crypto = require("simple-crypto-js").default;
let secretKey  = fs.readFileSync('./config/secret.key', 'utf8');
let crypto = new Crypto(secretKey);

// gets all users associated with a repo_full_name
// required inputs: token and repo_full_name
// on success: token, array of users from repo_full_name, and message
// on failure: bad HTTP status code and error
exports.get = (req, res) => {
  // Check required fields
  if (!req.body.token) {
    return res.status(400).json({
      error: "Token can't be empty."
    });
  }
  if (!req.body.repo_full_name) {
    return res.status(400).json({
      error: "Repo Full Name can't be empty."
    });
  }

  let token, userId;
  if (jwt.verify(req.body.token) ) {
    // decode jwt, then decrypt userID
    token = jwt.decode(req.body.token);
    userId = crypto.decrypt(token.payload.userId);
    // for some reason, decrypt has double quotes which need
    // to be removed from both front and back of the string
    if (userId.length == 26) {
      userId = userId.substr(1, userId.length - 2);
    }
  }
  else {
    return res.status(401).json({
      error: "Token could not be verified."
    });
  }

  Level.find({repo_full_name: req.body.repo_full_name})
    .then(user => {
      if (!user || user.length == 0) {
        return res.status(404).json({
          error: "Users not found with provided repo full name."
        });
      }

      let cipher = crypto.encrypt(user._id);
      let payload = {userId: cipher};
      let token = jwt.sign(payload);

      res.json({
        token: token,
        repo_users: user,
        message: "Got all users from " + req.body.repo_full_name + " repo."
      });
    })
    .catch(err => {
      return res.status(404).json({
        error: err.message
      });
    })
}; // end get
