const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller.js');


router.post(
'/register',
[
body('username').isLength({ min: 4 }),
body('password').isLength({ min: 6 }),
],
authCtrl.register
);


router.post('/login', authCtrl.login);


module.exports = router;