const express = require("express");
const router = express.Router();

// from /api/users/

router.get("/test", (req, res) => res.json({ msg: "users working" }));

module.exports = router;
