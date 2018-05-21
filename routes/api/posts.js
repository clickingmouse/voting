const express = require("express");
const router = express.Router();

// from /api/posts/

router.get("/test", (req, res) => res.json({ msg: "posts working" }));

module.exports = router;
