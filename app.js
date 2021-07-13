const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");


const app = express();
//the css and images present locally in my system can be used
app.use('*/public',express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));//used to get the data the user enters

//Using the code below we take the signup.html file and host at root directory
app.get("/", function(req, res){
  res.sendFile(__dirname+"/index.html");
});

//post route
//to get the things user enter
app.post("/",function(req, res){

  var firstName = req.body.fname;
  var lastName = req.body.lname;
  var email = req.body.email;

  //*****************************ENTER YOU LIST ID HERE******************************
const listId = "754d123456";
//Creating an object with the users data
const subscribingUser = {
 firstName: firstName,
 lastName: lastName,
 email: email
};

//Uploading the data to the server
 async function run() {
const response = await mailchimp.lists.addListMember(listId, {
 email_address: subscribingUser.email,
 status: "subscribed",
 merge_fields: {
 FNAME: subscribingUser.firstName,
 LNAME: subscribingUser.lastName
}
});
//If all goes well logging the contact's id
 res.sendFile(__dirname + "/success.html")
 console.log(
`Successfully added contact as an audience member. The contact's id is ${
 response.id
 }.`
);
}

run().catch(e => res.sendFile(__dirname + "/failure.html"));


});

app.post("/failure",function(req, res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Server running at port 3000");
})

//Setting up MailChimp
mailchimp.setConfig({
//*****************************ENTER YOUR API KEY HERE******************************
 apiKey: "6cdsfgff9844f2f77d88efsdferc0e98-us6",
//*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
 server: "us6"
});
