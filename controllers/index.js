require("dotenv").config({ path: "./.env" });
const User = require("../models/user");
const cron = require('node-cron');
const stripe = require("stripe")(process.env.Stripe_Secret_Key);

const Index = (req, res, next) => {
  res.render("index");
};

const Payment = async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      name: req.body.full_name,
      phone: req.body.countryCode + req.body.phone,
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

    let phoneNumber = req.body.phone.replace(/[^0-9]/g, "");
    await User.findOneAndUpdate(
      { phone: req.body.countryCode + phoneNumber },
      { phone: req.body.countryCode + phoneNumber, payment: true, amount: req.body.amount },
      { upsert: true }
    );
    if (req.body.amount == "5") {
      // Calculate the next run time, 1 week from now
      const nextRunTime = new Date();
      nextRunTime.setDate(nextRunTime.getDate() + 7);

      // Format the next run time for cron
      const cronPattern = `${nextRunTime.getMinutes()} ${nextRunTime.getHours()} ${nextRunTime.getDate()} ${
        nextRunTime.getMonth() + 1
      } *`;

      // Schedule the task
      cron.schedule(cronPattern, async () => {
        // This function will be executed once after 1 week from the current time
        const user = await User.findOneAndUpdate({phone: m.sender.replace('@s.whatsapp.net', '')}, {payment: false, trial: false});
        console.log("Trail ended")
      });
    } else {
      // Get the current date and time
      const now = new Date();

      // Calculate the next run time, 1 month from now
      const nextRunTime = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        now.getHours(),
        now.getMinutes()
      );

      // Format the next run time for cron
      const cronPattern = `${nextRunTime.getMinutes()} ${nextRunTime.getHours()} ${nextRunTime.getDate()} ${
        nextRunTime.getMonth() + 1
      } *`;

      // Schedule the task
      cron.schedule(cronPattern, async () => {
        // This function will be executed after 1 month from the current time
        const user = await User.findOneAndUpdate({phone: m.sender.replace('@s.whatsapp.net', '')}, {payment: false, trial: false});
        console.log("Trail ended")
      });
    }
    console.log(data.status);
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

const Questions = (req, res, next) => {
  res.render("questions");
};

const TermsAndConditions = (req, res, next) => {
  res.render("terms-and-conditions");
};

const PrivacyPolicy = (req, res, next) => {
  res.render("pirvacy-policy");
};

exports.Index = Index;
exports.Payment = Payment;
exports.Questions = Questions;
exports.TermsAndConditions = TermsAndConditions;
exports.PrivacyPolicy = PrivacyPolicy;
