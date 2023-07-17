require("dotenv").config({ path: "./.env" });

const Index = (req, res, next) => { 
    res.render('index');
};

exports.Index = Index;
