const express = require("express");
const router = express.Router();

// from /api/profile/

router.get("/test", (req, res) => res.json({ msg: "profile working" }));

module.exports = router;
