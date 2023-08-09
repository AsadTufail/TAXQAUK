require("dotenv").config({ path: "./.env" });

const Index = (req, res, next) => { 
    res.render('index');
};

const Questions = (req, res, next) => { 
    res.render('questions');
};

exports.Index = Index;
exports.Questions = Questions;
