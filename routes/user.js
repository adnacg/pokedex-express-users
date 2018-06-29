const express = require('express');
const router = express.Router();
// users controller
const uc = require("../controllers/user.js");

// New User handler
router.get('/new', uc.showCreationForm);

// Database handler (CRUD)
router.post('/', uc.userCreate);

// export router to be used in app.js
module.exports = router;