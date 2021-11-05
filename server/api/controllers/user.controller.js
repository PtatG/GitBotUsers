/*
Project name: GitBot User Website
Written by: Phillip Tat
Date written: 10/17/21
For: UCF Senior Design Project
Purpose: Website for github bot users to see their levels, total experience earned,
and commit message data. (if possible, also send anonymous messages.)
*/
const User = require("../models/user.model.js");
const Commit = require("../models/commit.model.js");
const jwt = require("../jwt/jwtFunction.js");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const Crypto = require("simple-crypto-js").default;
let secretKey  = fs.readFileSync('./config/secret.key', 'utf8');
let crypto = new Crypto(secretKey);

// required inputs: repo_full_name, username, and password
// on success: outputs username and message
// on failure: bad HTTP status code and error
exports.register = (req, res) => {
  // Check required fields
  if (!req.body.repo_full_name) {
    return res.status(400).json({
      error: "Repo Full Name can't be empty."
    });
  }
  if (!req.body.username) {
    return res.status(400).json({
      error: "Username can't be empty."
    });
  }
  if (!req.body.password) {
    return res.status(400).json({
      error: "Password can't be empty."
    });
  }

  const user = new User({
    repo_full_name: [req.body.repo_full_name],
    username: req.body.username,
    password: req.body.password
  });

  user.password = bcrypt.hashSync(user.password, 10);

  // Save user in the database
  user.save()
    .then(data => {
      res.json({
        username: data.username,
        message: "User " + data.username + " registered successfully!"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err.message
      });
    });
}; // end register

// required inputs: username and password
// on success: token, repo_full_name array, username,
// liked_commits array, created_at, and message
// on failure: bad HTTP status code and error
exports.login = (req, res) => {
  // Check required fields
  if (!req.body.username) {
    return res.status(400).json({
      error: "Username required."
    });
  }
  if (!req.body.password) {
    return res.status(400).json({
      error: "Password required."
    });
  }

  // find one user based on username
  User.findOne({username: req.body.username})
    .then(user => {
      if (!user) {
        return res.status(500).json({
          error: "Error: Could not find user " + req.body.username + "."
        });
      }

      // check that the passwords match
      if ( !bcrypt.compareSync(req.body.password, user.password) ) {
        return res.status(401).json({
          error: "Incorrect password."
        });
      }

      // encrypt user ID before putting into payload
      let cipher = crypto.encrypt(user._id);
      let payload = {userId: cipher};
      let token = jwt.sign(payload);

      res.json({
        token: token,
        repo_full_name: user.repo_full_name,
        username: user.username,
        liked_commits: user.liked_commits,
        created_at: user.created_at,
        message: "User " + user.username + " login successful."
      });
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).json({
          error: "Username is of the wrong kind."
        });
      }
      return res.status(404).json({
        error: "Could not find username " + req.body.username + "."
      });
    });
}; // end login

// required inputs: token
// optional inputs: repo_full_name with add_repo, liked_commits, or password
// on success: token, repo_full_name array, username,
// liked_commits array, created_at, and message
// on failure: bad HTTP status code and error
exports.edit = (req, res) => {
  // Check required fields
  if (!req.body.token) {
    return res.status(400).json({
      error: "Token can't be empty."
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

  // Find user by id and replace empty variables
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          error: "User not found with provided ID"
        });
      }
      // update repo_full_name
      let repo_full_name = []
      if (!req.body.repo_full_name) {
        repo_full_name = user.repo_full_name;
      }
      else {
        // since add_repo is a boolean, can't use !req.body.add_repo to detect
        // whether it exists, in the case that it is false
        if (typeof req.body.add_repo === "undefined") {
          // if liked_commits exists and add_repo doesn't,
          // that means we are modifying likes for commits
          if (!req.body.liked_commits){
            return res.status(404).json({
              error: "Add_repo required if repo full name exists."
            });
          }
        }
        if (req.body.add_repo) {
          // check if repo_full_name is already in the array
          for (let i = 0; i < user.repo_full_name.length; i++) {
            if (req.body.repo_full_name == user.repo_full_name[i]) {
              return res.status(403).json({
                error: "Repo Full Name already exists. Can't add duplicates."
              });
            }
          }
          repo_full_name = user.repo_full_name.concat(req.body.repo_full_name);
        }
        else {
          // flag required in the case that user tries to delete repo_full_name
          // from the repo_full_name array but it doesn't exist
          let flag = true;
          // find position of repo_full_name and remove it from the array
          for (let i = 0; i < user.repo_full_name.length; i++) {
            if (user.repo_full_name[i] == req.body.repo_full_name) {
              repo_full_name = user.repo_full_name.splice(i, 1);
              flag = false;
            }
          }
          if (flag) {
            return res.status(403).json({
              error: "Cannot delete repo full name because it doesn't exist."
            })
          }
        }
      }
      // need to if else here because if password exists,
      // that means it needs to be replaced, so the password
      // must first be hashed before storing in the database
      if (!req.body.password) {
        req.body.password = user.password;
      }
      else {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
      }

      let liked_commits = []
      if (!req.body.liked_commits) {
        liked_commits = user.liked_commits;
      }
      else {
        // if user's liked_commits array is empty, just add to liked_commits array
        if (user.liked_commits.length == 0) {
          liked_commits.push(req.body.liked_commits);
          // then increment like in commBotCommits
          // must use quotes for commits.$[element].likes
          // and element.url or else this doesn't work
          Commit.findOneAndUpdate({
            repo_full_name: req.body.repo_full_name,
            username: req.body.username
            }, {
              $inc: {
                "commits.$[element].likes": 1
            }}, {
              arrayFilters: [
                {"element.url": req.body.liked_commits}
              ]
            })
            .catch(err => {
              return res.status(404).json({
                error: err.message
              });
            })
        }
        else {
          // update liked_commits, if it doesn't exist, add, if it exists, delete
          // flag to check if need to add after for loop
          let flag = true;
          for (let i = 0; i < user.liked_commits.length; i++) {
            if (user.liked_commits[i] == req.body.liked_commits) {
              liked_commits = user.liked_commits.splice(i + 1, 1);
              flag = false;
              // then decrement like in commBotCommits
              Commit.findOneAndUpdate({
                repo_full_name: req.body.repo_full_name,
                username: req.body.username
                }, {
                  $inc: {
                    "commits.$[element].likes": -1
                }}, {
                  arrayFilters: [
                    {"element.url": req.body.liked_commits}
                  ]
                })
                .catch(err => {
                  return res.status(404).json({
                    error: err.message
                  });
                })
            }
          }
          if (flag) {
            liked_commits = user.liked_commits.concat(req.body.liked_commits);
            // increment like in commBotCommits for appropriate commit
            Commit.findOneAndUpdate({
              repo_full_name: req.body.repo_full_name,
              username: req.body.username
              }, {
                $inc: {
                  "commits.$[element].likes": 1
              }}, {
                arrayFilters: [
                  {"element.url": req.body.liked_commits}
                ]
              })
              .catch(err => {
                return res.status(404).json({
                  error: err.message
                });
              })
          }
        }
      }

      // Find user by _id and update it
      User.findByIdAndUpdate(
        user._id, {
          repo_full_name: repo_full_name,
          liked_commits: liked_commits,
          password: req.body.password
        }, {
          new: true
        })
        .then(user => {
          if (!user) {
            return res.status(404).json({
              error: "User not found with provided ID"
            });
          }

          // encrypt user ID before putting into payload
          let cipher = crypto.encrypt(user._id);
          let payload = {userId: cipher};
          let token = jwt.sign(payload);

          res.json({
            token: token,
            repo_full_name: user.repo_full_name,
            username: user.username,
            liked_commits: user.liked_commits,
            created_at: user.created_at,
            message: "User " + user.username + " successfully updated!"
          });
        })
        .catch(err => {
          if (err.kind === "ObjectId") {
            return res.status(404).json({
              error: "User not found with id provided ID"
            });
          }
          return res.status(500).json({
            error: "Error updating user with id provided ID"
          });
        });
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).json({
          error: "User not found with provided ID"
        });
      }
      return res.status(500).json({
        error: "Error updating user with provided ID"
      });
    });
}; // end edit
