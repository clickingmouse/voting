const express = require("express");
const router = express.Router();

// from /api/profile/

// @route GET / api/profile/test
// @desc  Tests profile route
// @access Public

router.get("/test", (req, res) => res.json({ msg: "profile working" }));

module.exports = router;
