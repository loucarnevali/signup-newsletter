const express = require("express");
const bodyParser = require("body-parser");

const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
const port = process.env.PORT || 3000;

require("dotenv").config();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: process.env.API_SERVER,
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const listId = process.env.LIST_ID;
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  console.log(subscribingUser);

  async function run() {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        },
      });
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err.status);
      res.sendFile(__dirname + "/failure.html");
    }
  }
  run();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
