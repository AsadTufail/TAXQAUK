const express = require('express');
const router = express.Router();

const indexControllers = require('../controllers');
const whatsappHelper = require('../helper/whatsapp.js');

router.get('/', indexControllers.Index);
router.get('/questions', indexControllers.Questions);
router.get('/terms-and-conditions', indexControllers.TermsAndConditions)
router.get('/privacy-policy', indexControllers.PrivacyPolicy)
whatsappHelper.WhatsApp();

module.exports = router;
