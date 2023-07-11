const express = require('express');
const router = express.Router();

const indexControllers = require('../controllers');
const whatsappHelper = require('../helper/whatsapp.js');

router.get('/', indexControllers.Index);
router.get('/whatsapp', whatsappHelper.WhatsApp);

module.exports = router;
