require("dotenv").config({ path: "./.env" });
const User = require("../models/user");
const stripe = require("stripe")(process.env.Stripe_Secret_Key);

const Index = (req, res, next) => { 
    res.render('index');
};

const Payment = async (req, res) => {
    try {
        const customer = await stripe.customers.create({
            name: req.body.full_name,
            phone: req.body.phone,
            email: req.body.email,
            address: {
              line1: req.body.street_address,
              postal_code: req.body.zip,
              city: req.body.city, 
              country: req.body.country,
            },
            source: req.body.stripeToken,
          });
          
          const data = await stripe.charges.create({
            amount: req.body.amount * 100,
            currency: "usd",
            customer: customer.id,
          });

        await User.findOneAndUpdate({phone: req.body.phone}, {payment: true, amount: req.body.amount});
        console.log(data.status);
        res.redirect("/");

    } catch (error) {
        console.log(error.message);
    }

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
exports.Payment = Payment;
exports.Questions = Questions;
exports.TermsAndConditions = TermsAndConditions;
exports.PrivacyPolicy = PrivacyPolicy;
