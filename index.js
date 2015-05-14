// Warning, ugly code below

var express = require('express');
var request = require('request');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

var repo = process.env.REPO;
var token = process.env.ACCESS_TOKEN;
var commiter_email = process.env.EMAIL || "support@example.com";
var commiter_name = process.env.NAME || "Support";

app.get('/', function(request, response) {
  response.send('nope');
});

app.get('/report-pingdom', function(req, res) {
  console.log("Incoming pingdom");

  if(req.query.message) {
    var message = JSON.parse(req.query.message);
    if(message.action != "assign") {
      res.end("all ok now");
      return;
    }
    var id = message.incidentid;
    var desc = message.description;
    var date = (new Date()).toISOString().slice(0, 10);

    var content = new Buffer(
    "---\n" +
    "title: 'Automated report - incident #"+id+"'\n" +
    "---\n" +
    "\n\n" +
    "Pingdom reports issues reaching services.\n"
    ).toString("base64");

    var payload = {
      "message": "Post Incident #" + id,
      "commiter": {
        "name": commiter_name,
        "email": commiter_email
      },
      "content": content
    };
    console.log("Committing..");

    request.put("https://api.github.com/repos/" + repo + "/contents/_posts/" + date + "-incident-" + id + ".md?access_token=" + token,
    {
      headers: {
        "User-Agent": "Pingdom-Poster-Bot"
      },
      json: true,
      body: payload
    }, function(err, reponse, body) {
      console.log(body);
      res.end("ok");
    });
  } else {
    res.end("meh");
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
