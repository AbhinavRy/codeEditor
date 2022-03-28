const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/user');

router.get('/', userControllers.getUser);
router.post('/', userControllers.createUser);
router.post('/login', userControllers.authUser);

module.exports = router;