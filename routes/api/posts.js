const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// load poll model
const Poll = require("../../models/Poll");
//const Profile = require("../../models/Profile");
const validatePollInput = require("../../validation/poll");

// from /api/posts/

// @route GET / api/posts/test
// @desc  Tests posts route
// @access Public

router.get("/test", (req, res) => res.json({ msg: "posts working" }));

// @route GET / api/posts/
// @desc  get polls
// @access Public
router.get("/", (req, res) => {
  Poll.find()
    .sort({ date: -1 })
    .then(polls => res.json(polls))
    .catch(err => status(404).json({ nopollsfound: " No polls found" }));
});

// @route GET / api/posts/:id
// @desc  get poll by id
// @access Public
router.get("/:id", (req, res) => {
  Poll.findById(req.params.id)
    .then(poll => res.json(poll))
    .catch(err =>
      res.status(404).json({ nopollfound: " No poll found with that id" })
    );
});

// @route PoST / api/posts/
// @desc  Create poll
// @access Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePollInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPoll = new Poll({
      pollqtext: req.body.pollqtext,
      name: req.body.name,
      user: req.user.id
    });
    newPoll.save().then(post => res.json(post));
  }
);

// @route DELETE / api/posts/:id
// @desc  delete poll
// @access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Profile.findOne({ user: req.user.id }).then(profile => {
    Poll.findById(req.params.id)
      .then(poll => {
        if (poll.user.toString() != req.user.id) {
          return res.status(401).json({ notauthorized: "not authorized" });
        }
        // delete
        //console.log("deleting....", poll);
        poll.remove().then(() => {
          res.json({ success: true });
        });
      })
      .catch(err => res.status(404).json({ pollnotfound: "no Poll found" }));
    //}); // Profile.findOne
  }
);

// @route GET / api/posts/pollchoice/:id
// @desc  Create posts choice
// @access Privatae

router.post(
  "/pollchoice/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    /* need to change function
    const { errors, isValid } = validatePollInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
*/
    //console.log(req.params.id);
    Poll.findById(req.params.id)
      .then(poll => {
        //console.log(poll);
        const newOption = {
          pollOptionText: req.body.pollOptionText,
          //name: req.body.name,
          user: req.user.id
        };
        // Add to Array
        poll.pollOptions.unshift(newOption);
        poll.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ pollnotfound: "no poll found" }));
  }
);

module.exports = router;
