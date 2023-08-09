require("dotenv").config({ path: "./.env" });

const Index = (req, res, next) => { 
    res.render('index');
};

const Questions = (req, res, next) => { 
    res.render('questions');
};

const TermsAndConditions = (req, res, next) => { 
    res.render('terms-and-conditions');
};

const PrivacyPolicy = (req, res, next) => { 
    res.render('pirvacy-policy');
};

exports.Index = Index;
exports.Questions = Questions;
exports.TermsAndConditions = TermsAndConditions;
exports.PrivacyPolicy = PrivacyPolicy;
