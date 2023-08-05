const express = require('express');
const router = express.Router();

const indexControllers = require('../controllers');
const whatsappHelper = require('../helper/whatsapp.js');

router.get('/', indexControllers.Index);
whatsappHelper.WhatsApp();

module.exports = router;
