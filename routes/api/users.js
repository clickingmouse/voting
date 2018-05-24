const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");

//load validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// load user modul
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// from /api/users/

// @route GET / api/users/test
// @desc  Tests users route
// @access Public

router.get("/test", (req, res) => res.json({ msg: "users working" }));

// @route POST / api/users/register
// @desc  Register users route
// @access Public

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // check
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //first find if email exist
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route GET / api/users/login
// @desc  Register users route / return JWT
// @access Public

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // check
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    //check for user
    if (!user) {
      errors.email = "Invalid User Email";
      return res.status(400).json(errors);
      //      return res.status(404).json({ email: "User Email not found" });
    }

    // check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // generate token
        //res.json({ msg: " login success" });
        //payload for jwt
        const payload = { id: user.id, name: user.name, avatar: user.avatar };

        //Sign the token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password Incorrect";
        return res.status(400).json(errors);
        //        return res.status(400).json({ password: "Password Incorrect" });
      }
    });
  });
});

// @route GET / api/users/current
// @desc  Return current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //  res.json({ msg: "success" });
    //res.json(req.user);
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
