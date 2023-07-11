require("dotenv").config({ path: "./.env" });

const Index = (req, res, next) => {
    res.send("hi")
};

exports.Index = Index;
